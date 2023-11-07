import { AwsResourceGroup } from "@notation/aws.iac/client";
import { apiGateway, lambda } from "@notation/aws.iac/resources";
import { ApiGatewayHandler, fn } from "./lambda";

export const api = (rgConfig: { name: string }) => {
  const apiGroup = new AwsResourceGroup("api", rgConfig);

  const apiResource = apiGroup.add(
    new apiGateway.Api({
      config: {
        Name: rgConfig.name,
        ProtocolType: "HTTP",
      },
    }),
  );

  apiGroup.add(
    new apiGateway.Stage({
      config: { StageName: "$default", AutoDeploy: true },
      dependencies: { router: apiResource },
    }),
  );

  return apiGroup;
};

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string, // todo: http methods only
  path: `/${string}`,
  handler: ApiGatewayHandler,
) => {
  const apiResource = apiGroup.findResource(
    "aws/api-gateway",
  ) as apiGateway.ApiInstance;

  // at compile time becomes infra module
  const fnGroup = handler as any as ReturnType<typeof fn>;

  const routeGroup = new AwsResourceGroup("api/route", {
    dependencies: { router: apiGroup.id, fn: fnGroup.id },
  });

  let integration;

  const lambdaResource = fnGroup.findResource(
    "aws/lambda",
  )! as lambda.LambdaInstance;

  const permission = fnGroup.findResource("aws/lambda/permission/api-gateway");

  integration = fnGroup.findResource(
    "aws/api-gateway/integration/lambda",
  ) as apiGateway.LambdaIntegrationInstance;

  if (!permission) {
    fnGroup.add(
      new lambda.LambdaApiGatewayPermission({
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  if (!integration) {
    integration = fnGroup.add(
      new apiGateway.LambdaIntegration({
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  routeGroup.add(
    new apiGateway.Route({
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
