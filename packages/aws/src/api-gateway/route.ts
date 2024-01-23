import type {
  ApiGatewayHandler,
  JWTAuthorizedApiGatewayHandler,
} from "src/shared";
import * as aws from "@notation/aws.iac";
import { lambda } from "src/lambda";
import { api } from "./api";
import { AuthorizerConfig, JWTAuthorizerConfig, NO_AUTH } from "./auth";
import { mapAuthConfig, mapAuthType } from "./utils";

export const route = (
  apiGroup: ReturnType<typeof api>,
  method: string, // todo: http methods only
  path: `/${string}`,
  auth: AuthorizerConfig,
  handler: ApiGatewayHandler,
) => {
  const apiResource = apiGroup.findResource(aws.apiGateway.Api)!;

  // at compile time becomes infra module
  const lambdaGroup = handler as any as ReturnType<typeof lambda>;

  const routeGroup = new aws.AwsResourceGroup("API Gateway/Route", {
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
        id: `${lambdaResource.id}-${apiResource.id}-permission`,
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  if (auth.type != "NONE") {
    const authConfig = mapAuthConfig(auth);

    const authorizer = new aws.apiGateway.RouteAuth({
      id: `${routeId}-${apiResource.id}-authorizer`,
      config: authConfig,
      dependencies: {
        api: apiResource,
      },
    });

    routeGroup.add(authorizer);
  }

  if (!integration) {
    integration = lambdaGroup.add(
      new aws.apiGateway.LambdaIntegration({
        id: `${apiResource.id}-${lambdaResource.id}-integration`,
        dependencies: {
          api: apiResource,
          lambda: lambdaResource,
        },
      }),
    );
  }

  const authorizerResource = routeGroup.findResource(aws.apiGateway.RouteAuth);

  routeGroup.add(
    new aws.apiGateway.Route({
      id: routeId,
      config: {
        AuthorizationScopes: auth.scopes,
        RouteKey: `${method} ${path}`,
        AuthorizationType: mapAuthType(auth),
      },
      dependencies: {
        api: apiResource,
        lambdaIntegration: integration,
        auth: authorizerResource,
      },
    }),
  );

  return routeGroup;
};
