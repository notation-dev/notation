import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/resources.ts", "src/client.ts"],
  dts: true,
  clean: true,
  format: ["esm"],
  platform: "node",
});
