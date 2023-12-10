import type { ApiGatewayHandler } from "src/shared";
import * as aws from "@notation/aws.iac";
import { lambda } from "src/lambda";
import { api } from "./api";

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string, // todo: http methods only
  path: `/${string}`,
  handler: ApiGatewayHandler,
) => {
  const apiResource = apiGroup.findResource(aws.apiGateway.Api)!;

  // at compile time becomes infra module
  const lambdaGroup = handler as any as ReturnType<typeof lambda>;

  const routeGroup = new aws.AwsResourceGroup("api/route", {
    dependencies: { router: apiGroup.id, fn: lambdaGroup.id },
  });

  const routeId = `${apiResource.id}-${method}-${path}`;

  let integration;

  const lambdaResource = lambdaGroup.findResource(aws.lambda.LambdaFunction)!;

  const permission = lambdaGroup.findResource(
    aws.lambda.LambdaApiGatewayV2Permission,
  );

  integration = lambdaGroup.findResource(aws.apiGateway.LambdaIntegration);

  if (!permission) {
    lambdaGroup.add(
      new aws.lambda.LambdaApiGatewayV2Permission({
        id: `${routeId}-permission`,
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  if (!integration) {
    integration = lambdaGroup.add(
      new aws.apiGateway.LambdaIntegration({
        id: `${routeId}-integration`,
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  routeGroup.add(
    new aws.apiGateway.Route({
      id: routeId,
      config: {
        RouteKey: `${method} ${path}`,
      },
      dependencies: {
        api: apiResource,
        lambdaIntegration: integration,
      },
    }),
  );

  return routeGroup;
};
