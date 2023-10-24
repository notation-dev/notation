import esbuild from "esbuild";
import {
  functionInfraPlugin,
  functionRuntimePlugin,
} from "@notation/esbuild-plugins";
import { glob } from "glob";

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
    bundle: true,
    format: "esm",
    treeShaking: true,
  });
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
