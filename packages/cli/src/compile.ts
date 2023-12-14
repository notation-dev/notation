import chokidar from "chokidar";
import { glob } from "glob";
import { log } from "console";
import esbuild from "esbuild";
import {
  functionInfraPlugin,
  functionRuntimePlugin,
} from "@notation/esbuild-plugins";
import { filePaths } from "@notation/core";

export async function compile(entryPoint: string, watch: boolean = false) {
  log(`${watch ? "Watching" : "Compiling"} infrastructure`, entryPoint);
  await compileInfra(entryPoint, watch);

  log(`${watch ? "Watching" : "Compiling"} functions`);

  // @todo: fnEntryPoints could be an output of compileInfra
  const fnEntryPoints = await glob("runtime/**/*.fn.ts");
  let disposeFnCompiler = await compileFns(fnEntryPoints, watch);

  if (!watch) return;

  chokidar
    .watch("**/*.fn.ts", {
      ignored: /node_modules/,
      persistent: true,
    })
    .on("all", async () => {
      if (disposeFnCompiler) disposeFnCompiler();
      const fnEntryPoints = await glob("runtime/**/*.fn.ts");
      disposeFnCompiler = await compileFns(fnEntryPoints, watch);
    });
}

export async function compileInfra(entryPoint: string, watch: boolean = false) {
  const context = await esbuild.context({
    entryPoints: [entryPoint],
    plugins: [functionInfraPlugin()],
    outdir: "dist",
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

export async function compileFns(
  entryPoints: string[],
  watch: boolean = false,
) {
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
      return () => context.dispose();
    } else {
      await context.rebuild();
      context.dispose();
    }
  }
}
