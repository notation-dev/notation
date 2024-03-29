import { getResourceGraph } from "src/orchestrator/graph";
import { deleteResource } from "../operations/operation.delete";
import { State } from "../state";
import { Resource } from "src/orchestrator/resource";

/**
 * @description Destroy resources that are in state but not in the orchestration graph
 */
export async function refreshState(
  entryPoint: string,
  dryRun = false,
): Promise<void> {
  const log = (message: string) =>
    dryRun ? console.log(`[Dry Run]: ${message}`) : console.log(message);

  log(`Refreshing ${entryPoint} state\n`);

  const graph = await getResourceGraph(entryPoint);
  const state = new State();

  for (const stateNode of (await state.values()).reverse()) {
    let resource = graph.resources.find((r) => r.id === stateNode.id);

    if (!resource) {
      const { moduleName, serviceName, resourceName } = stateNode.meta;
      const provider = await import(moduleName);
      const Resource = provider[serviceName][resourceName];

      resource = new Resource({
        id: stateNode.id,
        meta: stateNode.meta,
      }) as Resource;

      resource.setOutput(stateNode.output);

      if (!dryRun) {
        await deleteResource({ resource, state, dryRun });
      }

      log(`Deleted ${resource.type} ${resource.id}`);
    }
  }
}
