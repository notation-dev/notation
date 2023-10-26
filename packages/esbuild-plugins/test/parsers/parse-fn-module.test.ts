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
  it("allows no config to be exported", () => {
    const input = `
      export const getNum = handler(() => num);
      const num = 123;
    `;

    const { config } = parseFnModule(input);

    expect(config).toBeUndefined();
  });

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

    expect(config).toBe(
      '{ key1: "value1", key2: 123, key3: true, key4: false }',
    );
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
