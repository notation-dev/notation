import { createResourceFactory } from "@notation/core";
import {
  AddPermissionCommand,
  AddPermissionCommandInput,
  AddPermissionCommandOutput,
} from "@aws-sdk/client-lambda";
import { lambdaClient } from "src/utils/aws-clients";
import { generateApiGatewaySourceArn } from "src/templates/arn";
import { ApiInstance } from "src/resources/api-gateway/api";
import { LambdaInstance } from "./lambda";

export type LambdaApiGatewayPermissionInput = AddPermissionCommandInput;
export type LambdaApiGatewayPermissionOutput = AddPermissionCommandOutput;
export type LambdaApiGatewayPermissionDependencies = {
  lambda: LambdaInstance;
  api: ApiInstance;
};

const createLambdaApiGatewayPermissionClass = createResourceFactory<
  LambdaApiGatewayPermissionInput,
  LambdaApiGatewayPermissionOutput,
  LambdaApiGatewayPermissionDependencies
>();

export const LambdaApiGatewayPermission = createLambdaApiGatewayPermissionClass(
  {
    type: "aws/lambda/permission/api-gateway",

    getIntrinsicConfig: async (dependencies) => ({
      StatementId: "AllowExecutionFromAPIGateway",
      Principal: "apigateway.amazonaws.com",
      FunctionName: dependencies.lambda.output.FunctionName,
      Action: "lambda:InvokeFunction",
      SourceArn: await generateApiGatewaySourceArn(
        dependencies.api.output.ApiId!,
      ),
    }),

    deploy: async (config: LambdaApiGatewayPermissionInput) => {
      const command = new AddPermissionCommand(config);
      return lambdaClient.send(command);
    },
  },
);

export type LambdaApiGatewayPermissionInstance = InstanceType<
  typeof LambdaApiGatewayPermission
>;
