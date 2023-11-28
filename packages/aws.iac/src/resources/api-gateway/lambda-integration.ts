import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { ApiInstance } from "./api";
import { LambdaInstance } from "../lambda";
import { getLambdaInvocationUri } from "src/templates/arn";
import { apiGatewayClient } from "src/utils/aws-clients";

export type LambdaIntegrationSchema = {
  input: sdk.CreateIntegrationCommandInput;
  output: sdk.GetIntegrationCommandOutput;
  primaryKey: sdk.DeleteIntegrationCommandInput;
};

export type LambdaIntegrationDependencies = {
  api: ApiInstance;
  lambda: LambdaInstance;
};

const createLambdaIntegrationClass = createResourceFactory<
  LambdaIntegrationSchema,
  LambdaIntegrationDependencies
>();

export const LambdaIntegration = createLambdaIntegrationClass({
  type: "aws/api-gateway/integration/lambda",

  getPrimaryKey: (config, output) => ({
    ApiId: config.ApiId,
    IntegrationId: output.IntegrationId,
  }),

  getIntrinsicInput: (dependencies) => ({
    ApiId: dependencies.api.output.ApiId,
    IntegrationType: "AWS_PROXY",
    IntegrationMethod: "POST",
    IntegrationUri: getLambdaInvocationUri(
      dependencies.lambda.output.FunctionArn!,
    ),
    PayloadFormatVersion: "2.0",
    PassthroughBehavior: "WHEN_NO_MATCH",
    ConnectionType: "INTERNET",
  }),

  create: async (input) => {
    const command = new sdk.CreateIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },

  read: async (pk) => {
    const command = new sdk.GetIntegrationCommand(pk);
    return apiGatewayClient.send(command);
  },

  update: async (patch) => {
    const command = new sdk.UpdateIntegrationCommand(patch);
    return apiGatewayClient.send(command);
  },

  delete: async (pk) => {
    const command = new sdk.DeleteIntegrationCommand(pk);
    return apiGatewayClient.send(command);
  },
});

export type LambdaIntegrationInstance = InstanceType<typeof LambdaIntegration>;
