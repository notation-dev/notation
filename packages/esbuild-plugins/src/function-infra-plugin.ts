import esbuild, { Plugin } from "esbuild";
import { readConfigExport } from "./read-config-export";

/**
 * compiles cloud function modules
 * runs separate esbuild process to get exports metadata
 */
export function functionInfraPlugin(opts: {
  getFile: (filePath: string) => string | Promise<string>;
  esbuildInstance?: typeof esbuild;
}): Plugin {
  return {
    name: "function",
    setup(build) {
      build.onLoad({ filter: /.\.fn*/ }, async (args) => {
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

        let infraCode = `import { fn } from "@notation/sdk"`;

        if (exports.includes("config")) {
          const config = readConfigExport(fileContent);
          infraCode = infraCode.concat(`\nconst config = ${config};`);
        } else {
          infraCode = infraCode.concat(`\nconst config = {};`);
        }

        for (const handlerName of userExports) {
          infraCode = infraCode.concat(
            `\nexport const ${handlerName} = fn({ handler: "${handlerName}", ...config });`,
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
