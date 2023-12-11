import { destroyApp } from "@notation/core";
import { compile } from "./compile";

export async function destroy(entryPoint: string) {
  await compile(entryPoint);
  await destroyApp(entryPoint);
}
