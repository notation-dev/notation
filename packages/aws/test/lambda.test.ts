import { test, expect } from "bun:test";
import { handle } from "src/lambda";

test("handlers are identity functions", async () => {
  const fn = () => ({});
  for (const handler of Object.values(handle)) {
    const result = handler(fn);
    expect(result).toEqual(fn);
  }
});
