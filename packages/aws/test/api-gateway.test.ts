import { test, expect, beforeEach } from "vitest";
import { reset } from "@notation/core";
import { apiGateway } from "@notation/aws.iac";
import { NO_AUTH, api, router } from "src/api-gateway";
import { route } from "src/api-gateway/route";
import { lambda } from "src/lambda";

beforeEach(() => {
  reset();
});

test("route resource group idempotency snapshot", () => {
  const apiResourceGroup = api({ name: "api" });
  const fnResourceGroup = lambda({
    fileName: "src/fns/handler.fn.js",
    handler: "handler.fn.js",
  });

  route(apiResourceGroup, "GET", "/hello", NO_AUTH, fnResourceGroup as any);
  const fnResourceGroupSnapshot = JSON.stringify(fnResourceGroup);
  route(apiResourceGroup, "POST", "/hello", NO_AUTH, fnResourceGroup as any);
  const fnResourceGroupSnapshot2 = JSON.stringify(fnResourceGroup);

  expect(fnResourceGroupSnapshot).toEqual(fnResourceGroupSnapshot2);
});

test("router provides methods for each HTTP verb", () => {
  const apiResourceGroup = api({ name: "api" });
  const apiRouter = router(apiResourceGroup);
  const handler = lambda({
    fileName: "src/fns/handler.fn.js",
    handler: "handler.fn.js",
  });

  for (const method of ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
    const routerKey = method.toLowerCase() as keyof typeof apiRouter;
    const routeGroup = apiRouter[routerKey]("/hello", handler as any);
    const route = routeGroup.findResource(apiGateway.Route)!;
    expect(route.config.RouteKey).toEqual(`${method} /hello`);
  }
});
