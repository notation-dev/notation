import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { ApiInstance } from "./api";
import { LambdaInstance } from "../lambda";
import { getLambdaInvocationUri } from "src/templates/arn";
import { apiGatewayClient } from "src/utils/aws-clients";

export type LambdaIntegrationSchema = {
  create: {
    input: sdk.CreateIntegrationCommandInput;
    output: sdk.CreateIntegrationCommandOutput;
  };
  read: {
    input: sdk.GetIntegrationCommandInput;
    output: sdk.GetIntegrationCommandOutput;
  };
  update: {
    input: sdk.UpdateIntegrationCommandInput;
    output: sdk.UpdateIntegrationCommandOutput;
  };
  delete: {
    input: sdk.DeleteIntegrationCommandInput;
    output: sdk.DeleteIntegrationCommandOutput;
  };
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
  idKey: "IntegrationId",

  getIntrinsicConfig: (dependencies) => ({
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

  read: async (input) => {
    const command = new sdk.GetIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },

  update: async (input) => {
    const command = new sdk.UpdateIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },

  delete: async (input) => {
    const command = new sdk.DeleteIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },
});

export type LambdaIntegrationInstance = InstanceType<typeof LambdaIntegration>;
