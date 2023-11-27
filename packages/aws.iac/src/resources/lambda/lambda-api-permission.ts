import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import { lambdaClient } from "src/utils/aws-clients";
import { generateApiGatewaySourceArn } from "src/templates/arn";
import { ApiInstance } from "src/resources/api-gateway/api";
import { LambdaInstance } from "./lambda";

export type LambdaApiGatewayPermissionSchema = {
  create: {
    input: sdk.AddPermissionCommandInput;
    output: sdk.AddPermissionCommandOutput;
  };
  read: {
    input: void;
    output: void;
  };
  update: {
    input: void;
    output: void;
  };
  delete: {
    input: sdk.RemovePermissionCommandInput;
    output: sdk.RemovePermissionCommandOutput;
  };
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
    idKey: "StatementId", // or another suitable key

    getIntrinsicConfig: async (dependencies) => ({
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

    read: async () => {},
    update: async () => {},

    delete: async (input) => {
      const command = new sdk.RemovePermissionCommand(input);
      return lambdaClient.send(command);
    },
  },
);

export type LambdaApiGatewayPermissionInstance = InstanceType<
  typeof LambdaApiGatewayPermission
>;
