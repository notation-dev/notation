import { getResourceGraph } from "src/orchestrator/graph";
import { createResource } from "../operations/operation.create";
import { readResource } from "../operations/operation.read";
import { updateResource } from "../operations/operation.update";
import { deleteResource } from "../operations/operation.delete";
import { State } from "../state";
import { diff } from "deep-object-diff";
import { BaseResource } from "src/orchestrator/resource";

export async function deployApp(
  entryPoint: string,
  dryRun = false,
): Promise<void> {
  console.log(`Deploying ${entryPoint}\n`);

  const graph = await getResourceGraph(entryPoint);
  const state = new State();

  for (const resource of graph.resources) {
    const stateNode = await state.get(resource.id);

    // 1. Has resource been created before?
    if (!stateNode) {
      await createResource({ resource, state, dryRun });
      continue;
    }

    // 2. Assign existing state output to resource
    resource.output = stateNode.output;

    // 3. Has resource changed?
    const inputsDiff = diff(await resource.getParams(), stateNode.params);
    const inputsChanged = Object.keys(inputsDiff).length > 0;

    if (inputsChanged) {
      console.log(`Resource ${resource.type} ${resource.id} has changed.`);
      if (!resource.update) {
        throw new Error(
          `Resource ${resource.type} ${resource.id} does not support update.`,
        );
      }

      await updateResource({ resource, state, patch: inputsDiff, dryRun });

      continue;
    }

    // 4. Has resource been deleted?
    const latestOutput = await readResource({ resource, stateNode, dryRun });

    if (latestOutput === null) {
      console.log(
        `Resource ${resource.type} ${resource.id} has been deleted remotely.`,
      );
      await createResource({ resource, state, dryRun });
      continue;
    }

    // 5. Has deployed resource drifted from its state?
    const outputsDiff = diff(stateNode.output, latestOutput);
    const outputsChanged = Object.keys(outputsDiff).length > 0;

    if (outputsChanged) {
      console.log(`Drift detected for ${resource.type} ${resource.id}.`);
      await updateResource({ resource, state, patch: outputsDiff, dryRun });
      continue;
    }
  }

  // 6. Has resource been removed from the orchestration graph?
  for (const stateNode of (await state.values()).reverse()) {
    let resource = graph.resources.find((r) => r.id === stateNode.id);

    if (!resource) {
      console.log(
        `Resource ${stateNode.meta.resourceName} ${stateNode.id} has been removed from the graph.`,
      );
      const { moduleName, serviceName, resourceName } = stateNode.meta;
      const provider = await import(moduleName);
      const Resource = provider[serviceName][resourceName];
      // todo: ensure the resource is hydrated with dependencies
      resource = new Resource({ config: stateNode.config }) as BaseResource;
      resource.id = stateNode.id;

      deleteResource({ resource, state, dryRun });
    }
  }
}
