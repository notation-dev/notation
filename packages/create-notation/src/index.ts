import { scaffoldApp } from "./scaffold";

const argv = process.argv.slice(2).filter((arg) => arg !== "--");
const appName = argv[0] ?? "notation-starter";

await scaffoldApp(appName);
