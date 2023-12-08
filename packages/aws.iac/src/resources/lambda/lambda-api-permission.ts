import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import * as z from "zod";
import { lambdaClient } from "src/utils/aws-clients";
import { AwsSchema } from "src/utils/types";
import { ApiInstance } from "src/resources/api-gateway/api";
import { LambdaFunctionInstance } from "./lambda";

export type LambdaApiGatewayV2PermissionSchema = AwsSchema<{
  Key: sdk.RemovePermissionRequest;
  CreateParams: sdk.AddPermissionRequest;
}>;

export type LambdaApiGatewayV2PermissionDependencies = {
  lambda: LambdaFunctionInstance;
  api: ApiInstance;
};

const lambdaApiGatewayV2Permission =
  resource<LambdaApiGatewayV2PermissionSchema>({
    type: "aws/lambda/LambdaApiGatewayv2Permission",
  });

const lambdaApiGatewayV2PermissionSchema =
  lambdaApiGatewayV2Permission.defineSchema({
    FunctionName: {
      valueType: z.string(),
      propertyType: "primaryKey",
      presence: "required",
    },
    StatementId: {
      valueType: z.string(),
      propertyType: "secondaryKey",
      presence: "required",
    },
    Qualifier: {
      valueType: z.string(),
      propertyType: "secondaryKey",
      presence: "optional",
    },
    RevisionId: {
      valueType: z.string(),
      propertyType: "secondaryKey",
      presence: "optional",
    },
    FunctionUrlAuthType: {
      valueType: z.enum(["NONE", "AWS_IAM"]),
      propertyType: "param",
      presence: "optional",
    },
    InvocationType: {
      valueType: z.enum(["Event", "RequestResponse", "DryRun"]),
      propertyType: "param",
      presence: "optional",
    },
    Policy: {
      valueType: z.string(),
      propertyType: "computed",
      presence: "optional",
    },
    PrincipalOrgID: {
      valueType: z.string(),
      propertyType: "param",
      presence: "optional",
    },
    Action: {
      valueType: z.string(),
      propertyType: "param",
      presence: "required",
      defaultValue: "lambda:InvokeFunction",
    },
    Principal: {
      valueType: z.string(),
      propertyType: "param",
      presence: "required",
      defaultValue: "apigateway.amazonaws.com",
    },
    SourceArn: {
      valueType: z.string(),
      propertyType: "param",
      presence: "optional",
    },
    EventSourceToken: {
      valueType: z.string(),
      propertyType: "param",
      presence: "optional",
    },
    SourceAccount: {
      valueType: z.string(),
      propertyType: "param",
      presence: "optional",
    },
  });

export const LambdaApiGatewayV2Permission = lambdaApiGatewayV2PermissionSchema
  .defineOperations({
    create: async (params) => {
      const command = new sdk.AddPermissionCommand(params);
      await lambdaClient.send(command);
    },
    delete: async (key) => {
      const command = new sdk.RemovePermissionCommand(key);
      await lambdaClient.send(command);
    },
  })
  .requireDependencies<LambdaApiGatewayV2PermissionDependencies>()
  .setIntrinsicConfig((deps) => ({
    FunctionName: deps.lambda.output.FunctionName,
  }));

export type LambdaApiGatewayV2PermissionInstance = InstanceType<
  typeof LambdaApiGatewayV2Permission
>;
