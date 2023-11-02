import { test, expect } from "bun:test";
import { api, route, router, json } from "src/api-gateway";
import { fn } from "src/lambda";

test("json returns a JSON string and a 200 status code", () => {
  const payload = { message: "Hello, world!" };
  const response = json(payload);
  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(JSON.stringify(payload));
});

test("api resource group snapshot", () => {
  const apiResourceGroup = api({ name: "api" });
  expect(apiResourceGroup).toMatchSnapshot();
});

test("route resource group snapshot", () => {
  const apiResourceGroup = api({ name: "api" });
  const fnResourceGroup = fn({ handler: "handler.fn.js" });

  const routeResourceGroup = route(
    apiResourceGroup,
    "GET",
    "/hello",
    fnResourceGroup as any,
  );

  expect(routeResourceGroup).toMatchSnapshot();
  expect(fnResourceGroup).toMatchSnapshot();
});

test("route resource group idempotency snapshot", () => {
  const apiResourceGroup = api({ name: "api" });
  const fnResourceGroup = fn({ handler: "handler.fn.js" });

  route(apiResourceGroup, "GET", "/hello", fnResourceGroup as any);
  const fnResourceGroupSnapshot = JSON.stringify(fnResourceGroup);
  route(apiResourceGroup, "POST", "/hello", fnResourceGroup as any);
  const fnResourceGroupSnapshot2 = JSON.stringify(fnResourceGroup);

  expect(fnResourceGroupSnapshot).toEqual(fnResourceGroupSnapshot2);
});

test("router provides methods for each HTTP verb", () => {
  const apiResourceGroup = api({ name: "api" });
  const apiRouter = router(apiResourceGroup);
  const handler = fn({ handler: "handler.fn.js" });

  for (const method of ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
    const route = (apiRouter as any)[method.toLowerCase()]("/hello", handler);
    expect(route.config.method).toEqual(method);
    expect(route.config.path).toEqual("/hello");
  }
});
