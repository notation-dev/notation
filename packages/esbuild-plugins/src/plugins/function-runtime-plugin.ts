import esbuild, { Plugin } from "esbuild";
import { removeConfigExport } from "src/parsers/remove-config-export";

export function functionRuntimePlugin(opts: {
  getFile: (filePath: string) => string | Promise<string>;
  esbuildInstance?: typeof esbuild;
}): Plugin {
  return {
    name: "function",
    setup(build) {
      build.onLoad({ filter: /.\.fn*/ }, async (args) => {
        const fileContent = await opts.getFile(args.path);
        const runtimeCode = removeConfigExport(fileContent);
        return {
          loader: "ts",
          contents: runtimeCode,
        };
      });
    },
  };
}
