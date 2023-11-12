import { test, expect } from "bun:test";
import { lambda } from "src/lambda";

test("lambda resource group snapshot", async () => {
  const fnResourceGroup = lambda({
    fileName: "src/fns/handler.fn/index.js",
    handler: "handler",
  });
  expect(fnResourceGroup).toMatchSnapshot();
});
