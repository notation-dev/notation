import pako from "pako";
import { fromUint8Array } from "js-base64";
import { ResourceGroup } from "../orchestrator/resource-group";
import { Resource } from "../orchestrator/resource";

export const createMermaidFlowChart = (
  resourceGroups: ResourceGroup[],
  resources: Resource[],
): string => {
  let mermaidString = "flowchart TD\n";
  let connectionsString = "";

  resourceGroups.forEach((group) => {
    mermaidString += `  subgraph ${group.type}_${group.id}\n`;
    group.resources.forEach((resource) => {
      mermaidString += `    ${resource.type}_${resource.id}(${resource.type})\n`;
    });
    mermaidString += `  end\n`;

    group.resources.forEach((resource) => {
      (Object.values(resource.dependencies) as Resource[]).forEach((dep) => {
        const depResource = resources.find((r) => r.id === dep.id);
        if (depResource) {
          connectionsString += `  ${resource.type}_${resource.id} --> ${depResource.type}_${dep.id}\n`;
        }
      });
    });
  });

  return `${mermaidString}\n${connectionsString}`;
};

export function createMermaidLiveUrl(mermaidCode: string) {
  const state = {
    code: mermaidCode,
    mermaid: JSON.stringify({ theme: "default" }, undefined, 2),
    autoSync: true,
    updateDiagram: true,
  };
  const json = JSON.stringify(state);
  const data = new TextEncoder().encode(json);
  const compressed = pako.deflate(data, { level: 9 });
  const string = fromUint8Array(compressed, true);
  return `https://mermaid.live/view#pako:${string}`;
}
