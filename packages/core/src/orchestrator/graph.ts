import path from "path";
import {
  getResources,
  getResourceGroups,
} from "src/orchestrator/state-getters";
import { filePaths } from "src/utils/paths";
import { reset } from "..";

export async function getResourceGraph(entryPoint: string) {
  reset();
  const outFilePath = filePaths.dist.infra(entryPoint);

  // todo: move into worker thread. this will cause memory leaks
  await import(path.join(process.cwd(), `${outFilePath}?${Date.now()}`));

  const resourceGroups = getResourceGroups();
  const resources = getResources();

  return { resourceGroups, resources };
}
