import { describe, expect, it, test } from "bun:test";
import { parseFnModule } from "src/parsers/parse-fn-module";

describe("parsing exports", () => {
  it("gets export identifiers", () => {
    const input = `
      export const getNum = handler(() => num);
      export const getDoubleNum = handler(() => num * 2);
      export const config = {};
      const num = 123;
    `;

    const { exports } = parseFnModule(input);

    expect(exports).toEqual(["getNum", "getDoubleNum", "config"]);
  });

  it("does not allow default exports", () => {
    const input = `export default {};`;

    expect(() => parseFnModule(input)).toThrow(
      /Default exports are not supported/,
    );
  });

  it("does not allow export declarations", () => {
    const inputs = [
      `export { something } from "./something";`,
      `export { a };`,
    ];

    inputs.forEach((input) => {
      expect(() => parseFnModule(input)).toThrow(
        /Re-exporting is not supported/,
      );
    });
  });

  it("does not allow class exports", () => {
    const input = `export class MyClass {};`;
    expect(() => parseFnModule(input)).toThrow(
      /Class exports are not supported/,
    );
  });
});

describe("parsing config", () => {
  it("parses primitive properties", () => {
    const input = `
    export const config = { 
      key1: "value1", 
      key2: 123, 
      key3: true, 
      key4: false 
    };
  `;

    const { config } = parseFnModule(input);

    expect(config).toEqual({
      key1: "value1",
      key2: 123,
      key3: true,
      key4: false,
    });
  });

  it("does not allow complex property types", () => {
    const inputs = [
      `export const config = { key1: [123] };`,
      `export const config = { key1: {} };`,
      `export const config = { key1: ref };`,
    ];
    for (const input of inputs) {
      expect(() => parseFnModule(input)).toThrow(
        /Invalid value type for key 'key1'/,
      );
    }
  });

  it("throws an error if no config is provided", async () => {
    const input = `
      import { handler } from "@notation/aws/api-gateway";
      export const getNum = handler(() => 1);
    `;
    expect(() => parseFnModule(input)).toThrow(
      /A config object was not exported/,
    );
  });

  it("returns a raw config string", () => {
    const input = `export const config = { 
      key1: "value1", 
      key2: 123, 
      key3: true, 
      key4: false 
    };`;

    const { configRaw } = parseFnModule(input);
    console.log(configRaw);

    expect(configRaw).toBe(
      `{ key1: "value1", key2: 123, key3: true, key4: false }`,
    );
  });

  describe("invalid config values", () => {
    const invalidInputs = {
      identifier: "export const config = identifier;",
      callExpression: "export const config = identifier;",
      string: "export const config = 123;",
      number: "export const config = '123';",
      array: "export const config = [];",
    };
    for (const [invalidType, invalidStatement] of Object.entries(
      invalidInputs,
    )) {
      test(invalidType, () => {
        expect(() => parseFnModule(invalidStatement)).toThrow(
          /'config' is not an object literal./,
        );
      });
    }
  });
});
