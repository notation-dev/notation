import { stripIndent } from "common-tags";
import { functionPlugin } from "../src/function-plugin";
import { createBuilder } from "./esbuild-test-utils";
import { expect, it } from "bun:test";

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

it("should strip runtime code", async () => {
  const input = `
    import twilio from "twilio";

    twilio.setup();

    export const myFunction1 = () => { /* ... */ };
    export const myFunction2 = () => { /* ... */ };
  `;

  const expected = stripIndent`
    import { createWorkflowNode } from "@notation/sdk";
    export const myFunction1 = createWorkflowNode("myFunction1");
    export const myFunction2 = createWorkflowNode("myFunction2");
  `;

  const output = await build(input);

  expect(output).toContain(expected);
});
