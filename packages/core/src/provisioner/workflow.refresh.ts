import { getResourceGraph } from "src/orchestrator/graph";
import { deleteResource } from "./operation.delete";
import { getState } from "./state";
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
  const state = await getState();

  for (const stateNode of state.values().reverse()) {
    let resource = graph.resources.find((r) => r.id === stateNode.id);

    if (!resource) {
      const Provider = await import(stateNode.provider);
      resource = new Provider(stateNode) as Resource;

      if (!dryRun) {
        await deleteResource(resource, state);
      }

      log(`Deleted ${resource.type} ${resource.id}`);
    }
  }
}
