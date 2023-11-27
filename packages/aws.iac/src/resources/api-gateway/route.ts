import { createResourceFactory } from "@notation/core";
import {
  CreateRouteCommand,
  CreateRouteCommandInput,
  CreateRouteCommandOutput,
} from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiInstance, LambdaIntegrationInstance } from ".";

export type RouteInput = CreateRouteCommandInput;
export type RouteOutput = CreateRouteCommandOutput;
export type RouteDeps = {
  api: ApiInstance;
  lambdaIntegration: LambdaIntegrationInstance;
};

const createRouteClass = createResourceFactory<
  RouteInput,
  RouteOutput,
  RouteDeps
>();

export const Route = createRouteClass({
  type: "aws/api-gateway/route",

  getIntrinsicConfig: (dependencies) => ({
    ApiId: dependencies.api.output.ApiId,
    Target: `integrations/${dependencies.lambdaIntegration.output.IntegrationId}`,
  }),

  create: async (props: RouteInput) => {
    const command = new CreateRouteCommand(props);
    return apiGatewayClient.send(command);
  },
});

export type RouteInstance = InstanceType<typeof Route>;
