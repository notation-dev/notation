import { expect, it } from "vitest";
import { stripIndent } from "common-tags";
import { functionRuntimePlugin } from "src/plugins/function-runtime-plugin";
import { createBuilder } from "test/esbuild-test-utils";

const buildRuntime = createBuilder((input) => ({
  entryPoints: ["entry.fn.ts"],
  plugins: [functionRuntimePlugin({ getFile: () => input })],
}));

it("strips infra code", async () => {
  const input = stripIndent`
    import { LambdaConfig } from "@notation/aws/lambda";
    import { handler } from "@notation/aws/api-gateway";

    const num = await fetch("http://api.com/num").then((res) => res.json());
    
    export const getNum = handler(() => num);
    export const getDoubleNum = handler(() => num * 2);
    
    export const config: LambdaConfig = {
      memory: 64,
      timeout: 5,
      environment: "node:16",
    };
  `;

  const expected = stripIndent`
    import { handler } from "@notation/aws/api-gateway";
    const num = await fetch("http://api.com/num").then((res) => res.json());
    export const getNum = handler(() => num);
    export const getDoubleNum = handler(() => num * 2);
  `;

  const output = await buildRuntime(input);

  expect(output).toContain(expected);
});
