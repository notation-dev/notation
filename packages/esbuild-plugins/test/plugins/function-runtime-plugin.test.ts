import { expect, it } from "bun:test";
import { stripIndent } from "common-tags";
import { functionRuntimePlugin } from "src/plugins/function-runtime-plugin";
import { createBuilder } from "test/esbuild-test-utils";

const buildRuntime = createBuilder((input) => ({
  plugins: [functionRuntimePlugin({ getFile: () => input })],
}));

it("should strip infra code", async () => {
  const input = stripIndent`
    import { FnConfig, handler } from "@notation/aws";

    const num = await fetch("http://api.com/num").then((res) => res.json());
    
    export const getNum = handler(() => num);
    export const getDoubleNum = handler(() => num * 2);
    
    export const config: FnConfig = {
      memory: 64,
      timeout: 5,
      environment: "node:16",
    };
  `;

  const expected = stripIndent`
    import { handler } from "@notation/aws";
    const num = await fetch("http://api.com/num").then((res) => res.json());
    export const getNum = handler(() => num);
    export const getDoubleNum = handler(() => num * 2);
  `;

  const output = await buildRuntime(input);

  expect(output).toContain(expected);
});
