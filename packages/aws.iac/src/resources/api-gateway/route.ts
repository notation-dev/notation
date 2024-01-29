import { resource } from "@notation/core";
import * as z from "zod";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiInstance, LambdaIntegrationInstance } from ".";
import { AwsSchema } from "src/utils/types";
import { AuthInstance } from "./auth";

type RouteSdkSchema = AwsSchema<{
  Key: sdk.DeleteRouteRequest;
  CreateParams: sdk.CreateRouteRequest;
  UpdateParams: sdk.UpdateRouteRequest;
  ReadResult: sdk.GetRouteResult;
}>;

type RouteDependencies = {
  api: ApiInstance;
  lambdaIntegration: LambdaIntegrationInstance;
  auth?: AuthInstance;
};

const route = resource<RouteSdkSchema>({
  type: "aws/apiGateway/Route",
});

export const routeSchema = route.defineSchema({
  RouteId: {
    valueType: z.string(),
    propertyType: "computed",
    presence: "required",
    primaryKey: true,
  },
  ApiId: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    secondaryKey: true,
  },
  ApiKeyRequired: {
    valueType: z.boolean(),
    propertyType: "param",
    presence: "optional",
  },
  ApiGatewayManaged: {
    valueType: z.boolean(),
    propertyType: "computed",
    presence: "optional",
  },
  AuthorizationScopes: {
    valueType: z.array(z.string()),
    propertyType: "param",
    presence: "optional",
  },
  AuthorizationType: {
    valueType: z.enum(["NONE", "AWS_IAM", "CUSTOM", "JWT"]),
    propertyType: "param",
    presence: "optional",
  },
  AuthorizerId: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  ModelSelectionExpression: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  OperationName: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  RequestModels: {
    valueType: z.record(z.string()),
    propertyType: "param",
    presence: "optional",
  },
  RequestParameters: {
    valueType: z.record(
      z.object({
        Required: z.boolean().optional(),
      }),
    ),
    propertyType: "param",
    presence: "optional",
  },
  RouteKey: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
  },
  RouteResponseSelectionExpression: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  Target: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
} as const);

export const Route = routeSchema
  .defineOperations({
    create: async (params) => {
      const command = new sdk.CreateRouteCommand(params);
      const result = await apiGatewayClient.send(command);

      return { RouteId: result.RouteId! };
    },
    read: async (key) => {
      const command = new sdk.GetRouteCommand(key);
      const result = await apiGatewayClient.send(command);
      return { ...key, ...result };
    },
    update: async (key, patch, params) => {
      const command = new sdk.UpdateRouteCommand({ ...key, ...params });
      await apiGatewayClient.send(command);
    },
    delete: async (key) => {
      const command = new sdk.DeleteRouteCommand(key);
      await apiGatewayClient.send(command);
    },
  })
  .requireDependencies<RouteDependencies>()
  .setIntrinsicConfig(({ deps }) => ({
    AuthorizerId: deps.auth?.output.AuthorizerId,
    ApiId: deps.api.output.ApiId,
    // todo: this is too opinionated, should be somewhere else
    Target: `integrations/${deps.lambdaIntegration.output.IntegrationId}`,
  }));

export type RouteInstance = InstanceType<typeof Route>;
