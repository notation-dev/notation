import { getResourceGraph } from "src/graph";
import { deleteResource } from "./operation.delete";
import { readState, writeState } from "./state";

export async function destroyApp(entryPoint: string) {
  console.log(`Destroying ${entryPoint}\n`);
  // todo: refresh state

  const graph = await getResourceGraph(entryPoint);
  const state = await readState();

  try {
    for (const stateNode of Object.values(state).reverse()) {
      if (stateNode.lastOperation === "delete") continue;

      const resource = graph.resources.find(
        (r) => r.id === Number(stateNode.id),
      );

      if (!resource) {
        console.log(`Resource ${stateNode.id} not found.`);
        throw new Error(
          `State is out of sync with the resource graph. Try running destroy again.`,
        );
      }

      await deleteResource(resource, state, stateNode);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await writeState(state);
  }
}
