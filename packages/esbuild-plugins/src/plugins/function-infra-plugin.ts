import path from "node:path";
import esbuild, { Plugin } from "esbuild";
import { readConfigExport } from "src/parsers/read-config-export";
import { GetFile, fsGetFile, withFileCheck } from "src/utils/get-file";

type PluginOpts = {
  getFile?: GetFile;
};

export function functionInfraPlugin(opts: PluginOpts = {}): Plugin {
  return {
    name: "function-infra",
    setup(build) {
      build.onLoad({ filter: /.\.fn*/ }, async (args) => {
        const getFile = withFileCheck(opts.getFile || fsGetFile);
        const fileContent = await getFile(args.path);

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

        let fileName = path.relative(process.cwd(), args.path);

        for (const handlerName of userExports) {
          infraCode = infraCode.concat(
            `\nexport const ${handlerName} = fn({ fileName: "${fileName}", handler: "${handlerName}", ...config });`,
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
