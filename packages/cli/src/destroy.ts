import { compile } from "./compile";
import { getResourceGraph } from "./utils";

export async function destroy(entryPoint: string) {
  await compile(entryPoint);
  await destroyApp(entryPoint);
}

export async function destroyApp(entryPoint: string) {
  console.log(`Destroying ${entryPoint}`);
  const graph = await getResourceGraph(entryPoint);
  for (const resource of graph.resources) {
    // await resource.runDestroy();
    console.log(`Destroyed ${resource.type} ${resource.id}`);
  }
}
