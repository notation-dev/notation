import { AwsResourceGroup } from "./core";
import { ApiGatewayHandler, fn } from "./lambda";

export type ApiConfig = {
  name: string;
};

export const api = (config: ApiConfig) => {
  const apiGroup = new AwsResourceGroup({ type: "api", config: config });

  const apiGateway = apiGroup.createResource({
    type: "api-gateway",
  });

  apiGroup.createResource({
    type: "api-gateway/stage",
    dependencies: {
      routerId: apiGateway.id,
    },
  });

  return apiGroup;
};

export const router = (apiGroup: ReturnType<typeof api>) => {
  const createRouteCallback =
    (method: string) => (path: string, handler: ApiGatewayHandler) => {
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

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string,
  path: string,
  handler: ApiGatewayHandler,
) => {
  const apiGateway = apiGroup.findResourceByType("api-gateway")!;

  // at compile time becomes infra module
  const fnGroup = handler as any as ReturnType<typeof fn>;

  const routeGroup = new AwsResourceGroup({
    type: "route",
    dependencies: {
      router: apiGroup.id,
      fn: fnGroup.id,
    },
    config: {
      service: "aws/api-gateway",
      path,
      method,
    },
  });

  let integration;

  const lambda = fnGroup.findResourceByType("lambda")!;
  const permission = fnGroup.findResourceByType("lambda/permission");
  integration = fnGroup.findResourceByType("lambda/integration");

  if (!integration) {
    integration = fnGroup.createResource({
      type: "lambda/integration",
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  if (!permission) {
    fnGroup.createResource({
      type: "lambda/permission",
      dependencies: {
        apiGatewayId: apiGateway.id,
        lambdaId: lambda.id,
      },
    });
  }

  routeGroup.createResource({
    type: "api-gateway/route",
    dependencies: {
      apiGatewayId: apiGateway.id,
      integrationId: integration.id,
    },
  });

  return routeGroup;
};

export const json = (result: any) => ({
  body: JSON.stringify(result),
  statusCode: 200,
});
