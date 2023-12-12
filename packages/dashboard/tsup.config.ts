import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["server/server.ts"],
  dts: true,
  format: ["esm"],
});
