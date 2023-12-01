import { getResourceGraph } from "src/orchestrator/graph";
import { deleteResource } from "./operation.delete";
import { getState } from "./state";
import { refreshState } from "./workflow.refresh";

export async function destroyApp(entryPoint: string) {
  console.log(`Destroying ${entryPoint}\n`);

  const graph = await getResourceGraph(entryPoint);
  const state = await getState();

  await refreshState(entryPoint);

  for (const resource of graph.resources.reverse()) {
    const stateNode = state.get(resource.id);
    if (!stateNode) {
      console.log(
        `[Skip]: Resource ${resource.type} ${resource.id} not found in state.`,
      );
      continue;
    }
    if (stateNode.lastOperation === "delete") continue;
    await deleteResource(resource, state, stateNode);
  }
}
