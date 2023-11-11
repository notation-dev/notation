#!/usr/bin/env node
import { program } from "commander";
import { compile } from "./compile";
import { deploy } from "./deploy";
import { visualise } from "./visualise";

program
  .command("init")
  .argument("[appName]", "app name", "notation-starter")
  .description("Create Notation App")
  .action(async (appName) => {
    console.log(`Creating app in ./${appName}`);
  });

program
  .command("compile")
  .argument("<entryPoint>", "entryPoint")
  .description("Compile Notation App")
  .action(async (entryPoint) => {
    await compile(entryPoint);
  });

program
  .command("viz")
  .argument("<entryPoint>", "entryPoint")
  .description("Visualise Notation App")
  .action(async (entryPoint) => {
    await visualise(entryPoint);
  });

program
  .command("deploy")
  .argument("<entryPoint>", "entryPoint")
  .description("Deploy Notation App")
  .action(async (entryPoint) => {
    await deploy(entryPoint);
  });

program.parse(process.argv);
