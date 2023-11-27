import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiInstance, LambdaIntegrationInstance } from ".";

export type RouteSchema = {
  create: {
    input: sdk.CreateRouteCommandInput;
    output: sdk.CreateRouteCommandOutput;
  };
  read: {
    input: sdk.GetRouteCommandInput;
    output: sdk.GetRouteCommandOutput;
  };
  update: {
    input: sdk.UpdateRouteCommandInput;
    output: sdk.UpdateRouteCommandOutput;
  };
  delete: {
    input: sdk.DeleteRouteCommandInput;
    output: sdk.DeleteRouteCommandOutput;
  };
};
export type RouteDeps = {
  api: ApiInstance;
  lambdaIntegration: LambdaIntegrationInstance;
};

const createRouteClass = createResourceFactory<RouteSchema, RouteDeps>();

export const Route = createRouteClass({
  type: "aws/api-gateway/route",
  idKey: "RouteId",

  getIntrinsicConfig: (dependencies) => ({
    ApiId: dependencies.api.output.ApiId,
    Target: `integrations/${dependencies.lambdaIntegration.output.IntegrationId}`,
  }),

  create: async (input) => {
    const command = new sdk.CreateRouteCommand(input);
    return apiGatewayClient.send(command);
  },

  read: async (input) => {
    const command = new sdk.GetRouteCommand(input);
    return apiGatewayClient.send(command);
  },

  update: async (input) => {
    const command = new sdk.UpdateRouteCommand(input);
    return apiGatewayClient.send(command);
  },

  delete: async (input) => {
    const command = new sdk.DeleteRouteCommand(input);
    return apiGatewayClient.send(command);
  },
});

export type RouteInstance = InstanceType<typeof Route>;
