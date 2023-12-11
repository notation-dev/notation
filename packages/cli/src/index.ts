#!/usr/bin/env node
import { program } from "commander";
import { compile } from "./compile";
import { deploy } from "./deploy";
import { destroy } from "./destroy";
import { visualise } from "./visualise";
import { watch } from "./watch";
import { scaffoldApp } from "./scaffold";

program
  .command("create")
  .argument("[appName]", "app name", "notation-starter")
  .description("Create Notation App")
  .action(async (appName) => {
    await scaffoldApp(appName);
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

program
  .command("destroy")
  .argument("<entryPoint>", "entryPoint")
  .description("Destroy Notation App")
  .action(async (entryPoint) => {
    await destroy(entryPoint);
  });

program
  .command("watch")
  .argument("<entryPoint>", "entryPoint")
  .description("Watch Notation App")
  .action(async (entryPoint) => {
    await watch(entryPoint);
  });

program.parse(process.argv);
