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
  .description("Compile Notation App")
  .action(async () => {
    console.log("Compiling app");
  });

program
  .command("deploy")
  .argument("[environment]", "environment", "dev")
  .description("Deploy Notation App")
  .action(async (stackName) => {
    console.log(`Deploying stack ${stackName}...`);
  });

program.parse(process.argv);
