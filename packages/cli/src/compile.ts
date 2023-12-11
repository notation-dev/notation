import { glob } from "glob";
import { log } from "console";
import esbuild from "esbuild";
import {
  functionInfraPlugin,
  functionRuntimePlugin,
} from "@notation/esbuild-plugins";
import { filePaths } from "@notation/core";

export async function compile(entryPoint: string, watch: boolean = false) {
  await compileInfra(entryPoint, watch);
  // @todo: fnEntryPoints could be an output of compileInfra
  const fnEntryPoints = await glob("**/*.fn.ts");
  await compileFns(fnEntryPoints, watch);
}

export async function compileInfra(entryPoint: string, watch: boolean) {
  log(`${watch ? "Watching" : "Compiling"} infrastructure`, entryPoint);

  const context = await esbuild.context({
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

  if (watch) {
    await context.watch();
  } else {
    await context.rebuild();
    context.dispose();
  }
}

export async function compileFns(entryPoints: string[], watch: boolean) {
  log(`${watch ? "Watching" : "Compiling"} functions`);

  for (const entryPoint of entryPoints) {
    const context = await esbuild.context({
      entryPoints: [entryPoint],
      plugins: [functionRuntimePlugin()],
      outfile: filePaths.dist.runtime.index(entryPoint),
      outExtension: { ".js": ".mjs" },
      bundle: true,
      format: "esm",
      platform: "node",
      treeShaking: true,
    });

    if (watch) {
      await context.watch();
    } else {
      await context.rebuild();
      context.dispose();
    }
  }
}
