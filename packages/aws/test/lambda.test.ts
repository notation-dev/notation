import { test, expect } from "bun:test";
import { handle, fn } from "src/lambda";

test("handlers are identity functions", async () => {
  const fn = () => ({});
  for (const handler of Object.values(handle)) {
    const result = handler(fn);
    expect(result).toEqual(fn);
  }
});

test("fn resource group snapshot", async () => {
  const fnResourceGroup = fn({
    fileName: "src/fns/handler.fn/index.js",
    handler: "handler",
  });
  expect(fnResourceGroup).toMatchSnapshot();
});
