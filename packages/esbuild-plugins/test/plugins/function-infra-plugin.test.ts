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
    import { handler, FnConfig } from "@notation/sdk";
    export const getNum = handler(() => 1);
  `;

  const expected = stripIndent`
    import { fn } from "@notation/sdk";
    const config = {};
    export const getNum = fn({ fileName: "entry.fn.ts", handler: "getNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});

it("merges config", async () => {
  const input = `
    import { handler, FnConfig } from "@notation/sdk";
    export const getNum = handler(() => 1);
    export const config: FnConfig = { memory: 64 };
  `;

  const expected = stripIndent`
    import { fn } from "@notation/sdk";
    const config = { memory: 64 };
    export const getNum = fn({ fileName: "entry.fn.ts", handler: "getNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});

it("should strip runtime code", async () => {
  const input = `
    import { handler } from "@notation/sdk";
    import lib from "lib";

    let num = lib.getNum();

    export const getNum = () => num;
    export const getDoubleNum = () => num * 2;`;

  const expected = stripIndent`
    import { fn } from "@notation/sdk";
    const config = {};
    export const getDoubleNum = fn({ fileName: "entry.fn.ts", handler: "getDoubleNum", ...config });
    export const getNum = fn({ fileName: "entry.fn.ts", handler: "getNum", ...config });
  `;

  const output = await buildInfra(input);

  expect(output).toContain(expected);
});
