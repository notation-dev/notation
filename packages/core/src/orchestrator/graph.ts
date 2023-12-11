import path from "path";
import {
  getResources,
  getResourceGroups,
} from "src/orchestrator/state-getters";
import { filePaths } from "src/utils/paths";

export async function getResourceGraph(entryPoint: string) {
  const outFilePath = filePaths.dist.infra(entryPoint);
  await import(path.join(process.cwd(), outFilePath));

  const resourceGroups = getResourceGroups();
  const resources = getResources();

  return { resourceGroups, resources };
}
