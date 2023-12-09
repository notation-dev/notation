import { getResourceGraph } from "src/orchestrator/graph";
import { deleteResource } from "../operations";
import { State } from "../state";
import { refreshState } from "./workflow.refresh";

export async function destroyApp(entryPoint: string) {
  console.log(`Destroying ${entryPoint}\n`);

  const graph = await getResourceGraph(entryPoint);
  const state = new State();

  await refreshState(entryPoint);

  for (const resource of graph.resources.reverse()) {
    const stateNode = await state.get(resource.id);
    if (!stateNode) {
      console.log(
        `[Skip]: Resource ${resource.type} ${resource.id} not found in state.`,
      );
      continue;
    }
    resource.output = stateNode.output;
    await deleteResource({ resource, state });
  }
}
