import esbuild, { Plugin } from "esbuild";

/**
 * compiles cloud function modules
 * runs separate esbuild process to get exports metadata
 */
export function functionPlugin(opts: {
  fileIsFunction: (filePath: string) => boolean;
  getFile: (filePath: string) => string | Promise<string>;
  esbuildInstance?: typeof esbuild;
}): Plugin {
  return {
    name: "function",
    setup(build) {
      build.onLoad({ filter: /.*$/ }, async (args) => {
        const isFunction = await opts.fileIsFunction(args.path);
        if (!isFunction) return;

        const esbuild = opts.esbuildInstance || (await import("esbuild"));
        const fileContent = await opts.getFile(args.path);

        const compiled = await esbuild.build({
          metafile: true,
          write: false,
          format: "esm",
          target: "esnext",
          stdin: {
            contents: fileContent,
            loader: "ts",
            sourcefile: args.path,
          },
        });

        const exports = compiled.metafile?.outputs["stdin.js"]?.exports!;
        const reservedExports = ["preload", "config"];
        const userExports = exports.filter((e) => !reservedExports.includes(e));

        if (userExports.length === 0) {
          throw new Error(
            "Cloud functions should export one user-named handler. Ensure a handler is being exported and make sure you have chosen a non-standard name.",
          );
        }

        if (userExports.length > 1) {
          throw new Error(
            "Cloud functions should export one user-named handler. Remove any other non-standard exports.",
          );
        }

        const handlerName = userExports[0];
        const stubCode = `import { createWorkflowNode } from "@notation/sdk"; export const ${handlerName} = createWorkflowNode("${handlerName}");`;

        return {
          contents: stubCode,
          loader: "ts",
        };
      });
    },
  };
}
