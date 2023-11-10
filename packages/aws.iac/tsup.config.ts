import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/resources.ts", "src/client.ts"],
  dts: true,
  format: ["esm"],
  platform: "node",
});
