import type {
  ApiGatewayHandler,
  JWTAuthorizedApiGatewayHandler,
} from "src/shared";
import { api, jwtAuthorizedRoute, route } from ".";
import { JWTAuthorizerConfig } from "./auth";

export const router = (apiGroup: ReturnType<typeof api>) => {
  const createRouteCallback =
    (method: string) => (path: `/${string}`, handler: ApiGatewayHandler) => {
      return route(apiGroup, method, path, handler);
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
      return jwtAuthorizedRoute(
        apiGroup,
        method,
        path,
        jwtAuthorizerConfig,
        handler,
      );
    };

  return {
    get: createRouteCallback("GET"),
    post: createRouteCallback("POST"),
    put: createRouteCallback("PUT"),
    patch: createRouteCallback("PATCH"),
    delete: createRouteCallback("DELETE"),
  };
};
