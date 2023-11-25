export const filePaths = {
  dist: {
    runtime: {
      index: (entryPoint: string) =>
        `dist/runtime/${entryPoint.replace(/.ts$/, "/index.mjs")}`,
    },
    infra: (entryPoint: string) =>
      `dist/infra/${entryPoint.replace(/.ts$/, ".mjs")}`,
  },
};
