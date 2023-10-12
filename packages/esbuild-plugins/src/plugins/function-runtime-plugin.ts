import { Plugin } from "esbuild";
import { removeConfigExport } from "src/parsers/remove-config-export";
import { GetFile, fsGetFile, withFileCheck } from "src/utils/get-file";

type PluginOpts = {
  getFile?: GetFile;
};

export function functionRuntimePlugin(opts: PluginOpts = {}): Plugin {
  return {
    name: "function",
    setup(build) {
      build.onLoad({ filter: /.\.fn*/ }, async (args) => {
        const getFile = withFileCheck(opts.getFile || fsGetFile);
        const fileContent = await getFile(args.path);
        const runtimeCode = removeConfigExport(fileContent);
        return {
          loader: "ts",
          contents: runtimeCode,
        };
      });
    },
  };
}
