import { Resource } from "@notation/core";
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
    await runDeploy(resource);
    console.log(`Deployed ${resource.type} ${resource.id}`);
  }
}

export async function runDeploy(resource: Resource) {
  let backoff = 1000;
  try {
    const input = await resource.getCreateInput();
    resource.output = await resource.create(input);
  } catch (err: any) {
    if (resource.retryOn?.includes(err.name)) {
      console.log(`Retrying ${resource.type} ${resource.id}`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 1.5;
      await runDeploy(resource);
    } else {
      throw err;
    }
  }
}
