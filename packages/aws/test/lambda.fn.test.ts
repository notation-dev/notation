import { test, expect, beforeEach } from "vitest";
import { reset } from "@notation/core";
import { handle, json } from "src/lambda.fn";

beforeEach(() => {
  reset();
});

test("handlers wrap user-provided handlers", async () => {
  const fn = async () => ({ body: "{}" });
  for (const handler of Object.values(handle)) {
    const result = await handler(fn)(
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMTIzNDU2Nzg5MCIsICJuYW1lIjogIkpvaG4gRG9lIiwgImlhdCI6IDE1MTYyMzkwMjJ9.vBbO0bfWhxupD6Gp6gIyWzgSZDvQewYV23j9LKm7nV8",
        },
      } as any,
      {} as any,
    );
    expect(result).toEqual({ body: "{}" });
  }
});

test("json returns a JSON string and a 200 status code", () => {
  const payload = { message: "Hello, world!" };
  const response = json(payload);
  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(JSON.stringify(payload));
});
