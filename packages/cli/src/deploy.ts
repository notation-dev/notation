import { compile } from "./compile";
import { getResourceGraph } from "./utils";

export async function deploy(entryPoint: string) {
  await compile(entryPoint);
  await deployApp(entryPoint);
}

export async function deployApp(entryPoint: string) {
  console.log(`Deploying ${entryPoint}`);
  const graph = await getResourceGraph(entryPoint);
  for (const resource of graph.resources) {
    await resource.runDeploy();
    console.log(`Deployed ${resource.type} ${resource.id}`);
  }
}
