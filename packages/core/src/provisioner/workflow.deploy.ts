import { getResourceGraph } from "src/orchestrator/graph";
import { createResource } from "./operation.create";
import { readResource } from "./operation.read";
import { updateResource } from "./operation.update";
import { deleteResource } from "./operation.delete";
import { getState } from "./state";
import { Resource } from "src/orchestrator/resource";
import { omitBy, isEqual } from "lodash-es";

const diff = <T extends Record<string, any>, U extends Record<string, any>>(
  object: T,
  base: U,
) => {
  return omitBy(object, (value, key) => {
    isEqual(value, base[key]);
  });
};

export async function deployApp(
  entryPoint: string,
  dryRun = false,
): Promise<void> {
  console.log(`Deploying ${entryPoint}\n`);

  // todo: make HoF operation.base
  const commit = async (message: string, operation: () => Promise<void>) => {
    if (dryRun) {
      console.log(`[Dry Run]: ${message}`);
      return;
    }
    try {
      await operation();
    } catch (err) {
      console.log(`[Error]: ${message}`);
      throw err;
    }
    console.log(`[Success]: ${message}`);
  };

  const graph = await getResourceGraph(entryPoint);
  const state = await getState();

  for (const resource of graph.resources) {
    const stateNode = state.get(resource.id);

    // 1. Has resource been created before?
    if (!stateNode || stateNode.lastOperation === "delete") {
      await commit(`Creating ${resource.type} ${resource.id}`, async () => {
        await createResource(resource, state);
      });

      continue;
    }

    // 2. Has resource changed?
    const inputsDiff = diff(await resource.getInput(), stateNode.input);

    if (inputsDiff.changed) {
      if (!resource.update) {
        throw new Error(
          `Resource ${resource.type} ${resource.id} does not support update.`,
        );
      }

      await commit(`Updating ${resource.type} ${resource.id}`, async () => {
        await updateResource(resource, state, inputsDiff);
      });

      continue;
    }

    // 3. Has resource been deleted?
    const latestOutput = await readResource(resource, state);

    if (!latestOutput) {
      console.log(
        `Resource ${resource.type} ${resource.id} has been deleted remotely.`,
      );

      await commit(`Recreating ${resource.type} ${resource.id}`, async () => {
        await createResource(resource, state);
      });

      continue;
    }

    // 4. Has unchanged resource drifted from its state?
    const outputsDiff = diff(stateNode.output, latestOutput);

    if (outputsDiff.changed) {
      console.log(`Drift detected for ${resource.type} ${resource.id}.`);

      await commit(`Reverting ${resource.type} ${resource.id}`, async () => {
        await updateResource(resource, state, resource.getInput());
      });

      continue;
    }

    // 5. Fallback – assign state output to resource
    // todo: figure out serialisation/deserialisation for array buffers
    // probably best if resources define their own serialisation/deserialisation
    // for zip, it can ignore the buffer in serialisation and read it from fs in deserialisation
    // for everything else, just have a default method on the resource class
    resource.output = stateNode.output;
  }

  // 6. Has resource been removed from the orchestration graph?
  for (const stateNode of state.values().reverse()) {
    let resource = graph.resources.find((r) => r.id === stateNode.id);

    if (!resource) {
      const { moduleName, serviceName, resourceName } = stateNode.meta;
      const provider = await import(moduleName);
      const Resource = provider[serviceName][resourceName];
      // todo: ensure the resource is hydrated correctly
      resource = new Resource({ config: stateNode.config }) as Resource;
      resource.id = stateNode.id;
      await deleteResource(resource, state, stateNode);
    }
  }
}
