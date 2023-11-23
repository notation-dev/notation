import type { ApiGatewayHandler } from "src/shared";
import * as aws from "@notation/aws.iac/resources";
import { AwsResourceGroup } from "@notation/aws.iac/client";
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

  const routeGroup = new AwsResourceGroup("api/route", {
    dependencies: { router: apiGroup.id, fn: lambdaGroup.id },
  });

  let integration;

  const lambdaResource = lambdaGroup.findResource(aws.lambda.Lambda)!;

  const permission = lambdaGroup.findResource(
    aws.lambda.LambdaApiGatewayPermission,
  );

  integration = lambdaGroup.findResource(aws.apiGateway.LambdaIntegration);

  if (!permission) {
    lambdaGroup.add(
      new aws.lambda.LambdaApiGatewayPermission({
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
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  routeGroup.add(
    new aws.apiGateway.Route({
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
