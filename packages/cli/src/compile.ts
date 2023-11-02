import esbuild from "esbuild";
import {
  functionInfraPlugin,
  functionRuntimePlugin,
} from "@notation/esbuild-plugins";
import {
  getResourceGroups,
  getResources,
  createMermaidFlowChart,
  createMermaidLiveUrl,
} from "@notation/core";
import { glob } from "glob";
import path from "path";

export async function compile(infraEntryPoint: string) {
  await compileInfra(infraEntryPoint);
  // @todo: fnEntryPoints could be an output of compileInfra
  const fnEntryPoints = await glob("**/*.fn.ts");
  await compileFns(fnEntryPoints);
}

export async function compileInfra(entryPoint: string) {
  await esbuild.build({
    entryPoints: [entryPoint],
    plugins: [functionInfraPlugin()],
    outdir: "dist/infra",
    outbase: ".",
    outExtension: { ".js": ".mjs" },
    bundle: true,
    format: "esm",
    treeShaking: true,
    external: ["@notation/core"],
  });
  const outFilePath = `dist/infra/${entryPoint.replace("ts", "mjs")}`;
  await import(path.join(process.cwd(), outFilePath));
  const resourceGroups = getResourceGroups();
  const resources = getResources();
  const chart = createMermaidFlowChart(resourceGroups, resources);
  const chartUrl = createMermaidLiveUrl(chart);
  console.log("\nGenerated infrastructure chart:\n");
  console.log(chartUrl);
}

export async function compileFns(entryPoints: string[]) {
  await esbuild.build({
    entryPoints: entryPoints,
    plugins: [functionRuntimePlugin()],
    outdir: "dist/runtime",
    outbase: ".",
    bundle: true,
    format: "esm",
    treeShaking: true,
  });
}
