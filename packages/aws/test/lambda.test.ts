import { beforeEach, test, expect } from "bun:test";
import { lambda } from "src/lambda";
import { resetResourceGroupCounters } from "@notation/core";

beforeEach(() => {
  resetResourceGroupCounters();
});

test("lambda resource group snapshot", async () => {
  const fnResourceGroup = lambda({
    fileName: "src/fns/handler.fn/index.js",
    handler: "handler",
  });
  expect(fnResourceGroup).toMatchSnapshot();
});
