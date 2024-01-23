import type { ApiGatewayHandler } from "src/shared";
import { api, route } from ".";
import { JWTAuthorizerConfig, NO_AUTH } from "./auth";

export const router = (apiGroup: ReturnType<typeof api>) => {
  const createRouteCallback =
    (method: string) => (path: `/${string}`, handler: ApiGatewayHandler) => {
      return route(apiGroup, method, path, NO_AUTH, handler);
    };

  return {
    get: createRouteCallback("GET"),
    post: createRouteCallback("POST"),
    put: createRouteCallback("PUT"),
    patch: createRouteCallback("PATCH"),
    delete: createRouteCallback("DELETE"),
  };
};

export const jwtAuthenticatedUserRouter = (
  apiGroup: ReturnType<typeof api>,
  jwtAuthorizerConfig: JWTAuthorizerConfig,
) => {
  const createRouteCallback =
    (method: string) => (path: `/${string}`, handler: ApiGatewayHandler) => {
      return route(apiGroup, method, path, jwtAuthorizerConfig, handler);
    };

  return {
    get: createRouteCallback("GET"),
    post: createRouteCallback("POST"),
    put: createRouteCallback("PUT"),
    patch: createRouteCallback("PATCH"),
    delete: createRouteCallback("DELETE"),
  };
};
