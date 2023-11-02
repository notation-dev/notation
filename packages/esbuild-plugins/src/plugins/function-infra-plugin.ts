import path from "node:path";
import { Plugin } from "esbuild";
import { parseFnModule } from "src/parsers/parse-fn-module";
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
        const fileName = path.relative(process.cwd(), args.path);
        const { config, configRaw, exports } = parseFnModule(fileContent);

        const reservedNames = ["preload", "config"];

        let infraCode = `import { fn } from "@notation/${config.service}"`;
        infraCode = infraCode.concat(`\nconst config = ${configRaw};`);

        for (const handlerName of exports) {
          if (reservedNames.includes(handlerName)) continue;
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
