import esbuild, { BuildOptions, Plugin } from "esbuild";

const virtualFilePlugin = (input: any): Plugin => ({
  name: "virtual-file",
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      return { path: args.path, namespace: "stdin" };
    });
    build.onLoad({ filter: /.*/, namespace: "stdin" }, (args) => {
      return { contents: input, loader: "ts", resolveDir: args.path };
    });
  },
});

export function createBuilder(
  getBuildOptions: (input: string) => BuildOptions,
) {
  return async (input: string) => {
    const buildOptions = getBuildOptions(input);

    const result = await esbuild.build({
      entryPoints: ["entry.ts"],
      write: false,
      ...buildOptions,
      plugins: [...(buildOptions.plugins || []), virtualFilePlugin(input)],
      logLevel: "silent",
    });

    return result.outputFiles![0].text;
  };
}
