import { destroyApp } from "@notation/core";

export async function destroy(entryPoint: string) {
  await destroyApp(entryPoint);
}
