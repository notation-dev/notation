import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/api-gateway/index.ts",
    "src/lambda/index.ts",
    "src/lambda.fn/index.ts",
    "src/shared/index.ts",
  ],
  splitting: false,
  dts: true,
  format: ["esm"],
  platform: "node",
});
