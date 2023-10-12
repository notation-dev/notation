#!/usr/bin/env node
import { program } from "commander";

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
    console.log("Compiling", entryPoint);
  });

program
  .command("deploy")
  .argument("<environment>", "environment")
  .description("Deploy Notation App")
  .action(async (stackName) => {
    console.log(`Deploying stack ${stackName}...`);
  });

program.parse(process.argv);
