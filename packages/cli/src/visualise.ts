import {
  createMermaidFlowChart,
  createMermaidLiveUrl,
  getResourceGraph,
} from "@notation/core";
import { log } from "console";
import { compileInfra } from "./compile";

export async function visualise(entryPoint: string) {
  await compileInfra(entryPoint);
  await generateGraph(entryPoint);
}

export async function generateGraph(entryPoint: string) {
  log(`Generating graph for ${entryPoint}`);

  const graph = await getResourceGraph(entryPoint);
  const chart = createMermaidFlowChart(graph.resourceGroups, graph.resources);
  const chartUrl = createMermaidLiveUrl(chart);

  log("\nGenerated infrastructure chart:\n");
  log(chartUrl);
}
