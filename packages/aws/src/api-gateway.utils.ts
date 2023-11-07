import { ApiGatewayHandler } from "./lambda";
import { api, route } from "./api-gateway.infra";

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

export const json = (result: any) => ({
  body: JSON.stringify(result),
  statusCode: 200,
});
