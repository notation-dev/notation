export const filePaths = {
  dist: {
    runtime: {
      index: (entryPoint: string) =>
        `dist/${entryPoint.replace(/.ts$/, "/index.mjs")}`,
    },
    infra: (entryPoint: string) => `dist/${entryPoint.replace(/.ts$/, ".mjs")}`,
  },
};
