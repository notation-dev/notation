import { describe, expect, test } from "bun:test";
import { readConfigExport } from "../src/read-config-export";

test("Valid config object", () => {
  const input = `
    export const config = { 
      key1: "value1", 
      key2: 123, 
      key3: true, 
      key4: false 
    };
  `;
  expect(readConfigExport(input)).toBe(
    '{ key1: "value1", key2: 123, key3: true, key4: false }',
  );
});

test("Config object with invalid value type", () => {
  const input = `
    export const config = { 
      key1: [123],  
    };
  `;
  expect(() => readConfigExport(input)).toThrow(
    /Invalid value type for key 'key1'/,
  );
});

test("No config object", () => {
  const input = `export const somethingElse = { key1: "value1" };`;
  expect(() => readConfigExport(input)).toThrow(
    /No named export 'config' found./,
  );
});

describe("invalid inputs", () => {
  const invalidInputs = {
    identifier: "export const config = identifier;",
    callExpression: "export const config = identifier;",
    string: "export const config = 123;",
    number: "export const config = '123';",
    array: "export const config = [];",
  };
  for (const [invalidType, invalidStatement] of Object.entries(invalidInputs)) {
    test(invalidType, () => {
      expect(() => readConfigExport(invalidStatement)).toThrow(
        /'config' is not an object literal./,
      );
    });
  }
});
