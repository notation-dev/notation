import { expect, it } from "vitest";
import { stripIndent } from "common-tags";
import { functionPlugin } from "../src/function-plugin";
import { createBuilder } from "./esbuild-test-utils";

const build = createBuilder((input) => ({
  plugins: [
    functionPlugin({ fileIsFunction: () => true, getFile: () => input }),
  ],
}));

it("remaps exports", async () => {
  const input = `
    export function myFunction() { /* ... */ }
  `;

  const expected = stripIndent`
    import { createWorkflowNode } from "@notation/sdk";
    export const myFunction = createWorkflowNode("myFunction");
  `;

  const output = await build(input);

  expect(output).toContain(expected);
});

it("should handle cases when there are no user exports", async () => {
  const fileContent = "export const config = { /* ... */ }";

  await expect(() => build(fileContent)).rejects.toThrowError(
    "Cloud functions should export one user-named handler. Ensure a handler is being exported and make sure you have chosen a non-standard name.",
  );
});

it("should handle cases when there are multiple user exports", async () => {
  const fileContent = `
    export const myFunction1 = () => { /* ... */ };
    export const myFunction2 = () => { /* ... */ };
  `;

  await expect(() => build(fileContent)).rejects.toThrowError(
    "Cloud functions should export one user-named handler. Remove any other non-standard exports.",
  );
});
