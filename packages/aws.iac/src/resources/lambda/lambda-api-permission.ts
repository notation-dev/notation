import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import { lambdaClient } from "src/utils/aws-clients";
import { generateApiGatewaySourceArn } from "src/templates/arn";
import { ApiInstance } from "src/resources/api-gateway/api";
import { LambdaInstance } from "./lambda";

export type LambdaApiGatewayPermissionSchema = {
  input: sdk.AddPermissionCommandInput;
  output: sdk.AddPermissionCommandOutput;
  primaryKey: sdk.RemovePermissionCommandInput;
};

export type LambdaApiGatewayPermissionDependencies = {
  lambda: LambdaInstance;
  api: ApiInstance;
};

const createLambdaApiGatewayPermissionClass = createResourceFactory<
  LambdaApiGatewayPermissionSchema,
  LambdaApiGatewayPermissionDependencies
>();

export const LambdaApiGatewayPermission = createLambdaApiGatewayPermissionClass(
  {
    type: "aws/lambda/permission/api-gateway",

    getPrimaryKey: (input) => ({
      StatementId: input.StatementId,
      FunctionName: input.FunctionName,
    }),

    getIntrinsicInput: async (dependencies) => ({
      StatementId: "AllowExecutionFromAPIGateway",
      Principal: "apigateway.amazonaws.com",
      FunctionName: dependencies.lambda.output.FunctionName,
      Action: "lambda:InvokeFunction",
      SourceArn: await generateApiGatewaySourceArn(
        dependencies.api.output.ApiId!,
      ),
    }),

    create: async (input) => {
      const command = new sdk.AddPermissionCommand(input);
      return lambdaClient.send(command);
    },

    delete: async (pk) => {
      const command = new sdk.RemovePermissionCommand(pk);
      return lambdaClient.send(command);
    },
  },
);

export type LambdaApiGatewayPermissionInstance = InstanceType<
  typeof LambdaApiGatewayPermission
>;
