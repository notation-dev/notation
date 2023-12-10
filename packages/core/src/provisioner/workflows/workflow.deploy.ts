import { getResourceGraph } from "src/orchestrator/graph";
import { createResource } from "../operations/operation.create";
import { readResource } from "../operations/operation.read";
import { updateResource } from "../operations/operation.update";
import { deleteResource } from "../operations/operation.delete";
import { State } from "../state";
import * as deepDiff from "deep-object-diff";
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
    resource.setOutput(stateNode.output);

    // 3. Have the desired params changed from the state?
    const params = await resource.getParams();

    // diff to transition from last state to current params
    const localDiff = deepDiff.diff(
      resource.toComparable(stateNode.params),
      resource.toComparable(params),
    );

    const stateIsStale = Object.keys(localDiff).length > 0;

    if (stateIsStale) {
      console.log(
        `Resource ${resource.type} ${resource.id} has changed. Updating...`,
      );
      console.log(localDiff);

      await updateResource({ resource, state, patch: localDiff, dryRun });
      continue;
    }

    const latestOutput = await readResource({ resource, state, dryRun });

    // 4. Has resource been deleted?
    if (latestOutput === null) {
      console.log(
        `Resource ${resource.type} ${resource.id} has been deleted remotely.`,
      );
      await createResource({ resource, state, dryRun });
      continue;
    }

    // 5. Have the params of the live resource drifted from the state?
    const remoteDetailedDiff = deepDiff.detailedDiff(
      resource.toComparable(latestOutput),
      resource.toComparable(stateNode.output),
    );

    // diff to transition from live to declared state
    const remoteDiff = {
      ...remoteDetailedDiff.updated,
      ...remoteDetailedDiff.added,
    };
    const resourceHasDrifted = Object.keys(remoteDiff).length > 0;

    if (resourceHasDrifted) {
      console.log(
        `Drift detected for ${resource.type} ${resource.id}. Reverting...`,
      );
      console.log(remoteDiff);
      await updateResource({ resource, state, patch: remoteDiff, dryRun });
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
      resource = new Resource({ config: stateNode.config }) as BaseResource;
      resource.id = stateNode.id;
      resource.setOutput(stateNode.output);

      await deleteResource({ resource, state, dryRun });
    }
  }
}
