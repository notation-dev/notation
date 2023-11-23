import path from "path";
import { getResources, getResourceGroups, filePaths } from "@notation/core";

export async function getResourceGraph(entryPoint: string) {
  const outFilePath = filePaths.dist.infra.index(entryPoint);
  await import(path.join(process.cwd(), outFilePath));

  const resourceGroups = getResourceGroups();
  const resources = getResources();

  return { resourceGroups, resources };
}
