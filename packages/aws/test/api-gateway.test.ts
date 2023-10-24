import { test, expect } from "bun:test";
import { handler, json } from "src/api-gateway";
import { handle } from "src/lambda";

test("handler re-exports handle.apiGateway", () => {
  expect(handler).toEqual(handle.apiGateway);
});

test("json returns a JSON string and a 200 status code", () => {
  const payload = { message: "Hello, world!" };
  const response = json(payload);
  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(JSON.stringify(payload));
});
