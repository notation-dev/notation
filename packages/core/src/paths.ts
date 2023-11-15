export const filePaths = {
  dist: {
    runtime: {
      index: (entryPoint: string) =>
        `dist/runtime/${entryPoint.replace(/.ts$/, "/index.mjs")}`,
    },
    infra: {
      index: (entryPoint: string) =>
        `dist/infra/${entryPoint.replace(/.ts$/, ".mjs")}`,
    },
  },
};
