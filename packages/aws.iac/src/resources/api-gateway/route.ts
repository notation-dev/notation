import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiInstance, LambdaIntegrationInstance } from ".";

export type RouteSchema = {
  input: sdk.CreateRouteCommandInput;
  output: sdk.GetRouteCommandOutput;
  primaryKey: sdk.DeleteRouteCommandInput;
};

export type RouteDeps = {
  api: ApiInstance;
  lambdaIntegration: LambdaIntegrationInstance;
};

const createRouteClass = createResourceFactory<RouteSchema, RouteDeps>();

export const Route = createRouteClass({
  type: "aws/apiGateway/Route",

  getPrimaryKey: (input, output) => ({
    ApiId: input.ApiId,
    RouteId: output.RouteId,
  }),

  getIntrinsicInput: (dependencies) => ({
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
