import { getResourceGraph } from "src/orchestrator/graph";
import { createResource } from "./operation.create";
import { readState, writeState } from "./state";

export async function deployApp(entryPoint: string) {
  console.log(`Creating ${entryPoint}\n`);

  const graph = await getResourceGraph(entryPoint);
  const state = await readState();

  try {
    for (const resource of graph.resources) {
      await createResource(resource, state);
      console.log(`Created ${resource.type} ${resource.id}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await writeState(state);
  }
}
