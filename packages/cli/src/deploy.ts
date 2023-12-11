import { deployApp } from "@notation/core";
import { compile } from "./compile";

export async function deploy(entryPoint: string) {
  await compile(entryPoint);
  console.log(`Deploying ${entryPoint}`);
  await deployApp(entryPoint);
}
