import fs from "fs";
import * as fflate from "fflate";
import { glob } from "glob";
import esbuild from "esbuild";
import {
  functionInfraPlugin,
  functionRuntimePlugin,
} from "@notation/esbuild-plugins";
import { getRuntimeOutFilePath } from "./utils";
import { log } from "console";

export async function compile(entryPoint: string) {
  await compileInfra(entryPoint);
  // @todo: fnEntryPoints could be an output of compileInfra
  const fnEntryPoints = await glob("**/*.fn.ts");
  await compileFns(fnEntryPoints);
}

export async function compileInfra(entryPoint: string) {
  log("Compiling infrastructure", entryPoint);

  await esbuild.build({
    entryPoints: [entryPoint],
    plugins: [functionInfraPlugin()],
    outdir: "dist/infra",
    outbase: ".",
    outExtension: { ".js": ".mjs" },
    bundle: true,
    format: "esm",
    platform: "node",
    treeShaking: true,
    packages: "external",
  });
}

export async function compileFns(entryPoints: string[]) {
  log("Compiling functions");

  for (const entryPoint of entryPoints) {
    await esbuild.build({
      entryPoints: [entryPoint],
      plugins: [functionRuntimePlugin()],
      outfile: getRuntimeOutFilePath(entryPoint),
      outExtension: { ".js": ".mjs" },
      bundle: true,
      format: "esm",
      platform: "node",
      treeShaking: true,
    });
  }
}
}
