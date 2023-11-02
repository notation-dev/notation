import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/core.ts", "src/lambda.ts", "src/api-gateway.ts"],
  splitting: false,
  dts: true,
  clean: true,
  format: ["cjs", "esm"],
});
