import { expect, it } from "bun:test";
import { stripIndent } from "common-tags";
import { functionInfraPlugin } from "src/plugins/function-infra-plugin";
import { createBuilder } from "test/esbuild-test-utils";

const buildInfra = createBuilder((input) => ({
  entryPoints: ["entry.fn.ts"],
  plugins: [functionInfraPlugin({ getFile: () => input })],
}));

it("remaps exports", async () => {
  const input = `
    import { handler } from "@notation/aws/api-gateway";
    export const config = { service: "aws/lambda" };
    export const getNum = handler(() => 1);
  `;

  const expected = stripIndent`
    import { lambda } from "@notation/aws/lambda";
    const config = { service: "aws/lambda" };
    export const getNum = lambda({ fileName: "dist/runtime/entry.fn/index.js", handler: "getNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});

it("merges config", async () => {
  const input = `
    import { LambdaConfig } from "@notation/aws/lambda";
    import { handler } from "@notation/aws/api-gateway";
    export const getNum = handler(() => 1);
    export const config: LambdaConfig = { service: "aws/lambda", memory: 64 };
  `;

  const expected = stripIndent`
    import { lambda } from "@notation/aws/lambda";
    const config = { service: "aws/lambda", memory: 64 };
    export const getNum = lambda({ fileName: "dist/runtime/entry.fn/index.js", handler: "getNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});

it("should strip runtime code", async () => {
  const input = `
    import { LambdaConfig } from "@notation/aws/lambda";
    import { handler } from "@notation/aws/api-gateway";
    import lib from "lib";

    let num = lib.getNum();

    export const getNum = () => num;
    export const getDoubleNum = () => num * 2;
    export const config = { service: "aws/lambda" };`;

  const expected = stripIndent`
    import { lambda } from "@notation/aws/lambda";
    const config = { service: "aws/lambda" };
    export const getNum = lambda({ fileName: "dist/runtime/entry.fn/index.js", handler: "getNum", ...config });
    export const getDoubleNum = lambda({ fileName: "dist/runtime/entry.fn/index.js", handler: "getDoubleNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});

// broken in bun 1.0.7
it.skip("should fail if no config is exported", async () => {
  const input = `
    import { handler } from "@notation/aws/api-gateway";
    export const getNum = handler(() => 1);
  `;

  expect(buildInfra(input)).rejects.toThrow(/No config object was exported/);
});
