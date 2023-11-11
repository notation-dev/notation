import path from "path";
import { getResources, getResourceGroups } from "@notation/core";

export async function getResourceGraph(entryPoint: string) {
  const outFilePath = getInfraOutFilePath(entryPoint);
  await import(path.join(process.cwd(), outFilePath));

  const resourceGroups = getResourceGroups();
  const resources = getResources();

  return { resourceGroups, resources };
}

export const getInfraOutFilePath = (entryPoint: string) =>
  `dist/infra/${entryPoint.replace(/.ts$/, ".mjs")}`;

export const getRuntimeOutFilePath = (entryPoint: string) =>
  `dist/runtime/${entryPoint.replace(/.ts$/, "/index.mjs")}`;
