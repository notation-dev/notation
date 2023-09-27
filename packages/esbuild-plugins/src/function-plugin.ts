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

        let infraCode = `import { createWorkflowNode } from "@notation/sdk"`;

        for (const handlerName of userExports) {
          infraCode = infraCode.concat(
            `\nexport const ${handlerName} = createWorkflowNode("${handlerName}");`,
          );
        }

        return {
          contents: infraCode,
          loader: "ts",
        };
      });
    },
  };
}
