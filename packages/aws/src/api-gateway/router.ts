import type { ApiGatewayHandler } from "src/shared";
import { api, route } from ".";
import { AuthorizerConfig } from "./auth";

export const router = (apiGroup: ReturnType<typeof api>) => {
  const createRouteCallback =
    (method: string) => (path: `/${string}`, handler: ApiGatewayHandler, authorizer: AuthorizerConfig = undefined) => {
      return route(apiGroup, method, path, authorizer, handler);
    };

  return {
    get: createRouteCallback("GET"),
    post: createRouteCallback("POST"),
    put: createRouteCallback("PUT"),
    patch: createRouteCallback("PATCH"),
    delete: createRouteCallback("DELETE"),
  };
};
