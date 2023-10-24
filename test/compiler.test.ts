import { beforeAll, expect, it } from "bun:test";
import { $ } from "execa";
import path from "path";
import { glob } from "glob";

const cwd = path.join(import.meta.dir, "compiler.test.app");
const $$ = $({ cwd });

beforeAll(async () => {
  await $$`rm -rf dist`;
  await $$`npm run compile`;
});

it("generates infra and runtime modules matching source file structure", async () => {
  const expected = [
    "dist/infra/src/api.js",
    "dist/runtime/src/todos/todos.fn.js",
  ];

  const actual = await glob("dist/**/*.js", { cwd });

  expect(actual).toEqual(expected);
});
