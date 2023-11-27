import { createResourceFactory } from "@notation/core";
import {
  CreateIntegrationCommand,
  CreateIntegrationCommandInput,
  CreateIntegrationCommandOutput,
} from "@aws-sdk/client-apigatewayv2";
import { ApiInstance } from "./api";
import { LambdaInstance } from "../lambda";
import { getLambdaInvocationUri } from "src/templates/arn";
import { apiGatewayClient } from "src/utils/aws-clients";

export type LambdaIntegrationInput = CreateIntegrationCommandInput;
export type LambdaIntegrationOutput = CreateIntegrationCommandOutput;
export type LambdaIntegrationDependencies = {
  api: ApiInstance;
  lambda: LambdaInstance;
};

const createLambdaIntegrationClass = createResourceFactory<
  LambdaIntegrationInput,
  LambdaIntegrationOutput,
  LambdaIntegrationDependencies
>();

export const LambdaIntegration = createLambdaIntegrationClass({
  type: "aws/api-gateway/integration/lambda",

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
    const command = new CreateIntegrationCommand(input);
    return apiGatewayClient.send(command);
  },
});

export type LambdaIntegrationInstance = InstanceType<typeof LambdaIntegration>;
