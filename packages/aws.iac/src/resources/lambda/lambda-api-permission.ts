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

const lambdaApiGatewayv2Permission =
  resource<LambdaApiGatewayV2PermissionSchema>({
    type: "aws/lambda/LambdaApiGatewayv2Permission",
  });

const lambdaApiGatewayv2PermissionSchema =
  lambdaApiGatewayv2Permission.defineSchema({
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

export const LambdaApiGatewayv2Permission = lambdaApiGatewayv2PermissionSchema
  .implement({
    create: async (params) => {
      const command = new sdk.AddPermissionCommand(params);
      await lambdaClient.send(command);
    },
    delete: async (key) => {
      const command = new sdk.RemovePermissionCommand(key);
      await lambdaClient.send(command);
    },
  })
  .withIntrinsicConfig<LambdaApiGatewayV2PermissionDependencies>(
    (dependencies) => ({
      FunctionName: dependencies.lambda.output.FunctionName,
    }),
  );

export type LambdaApiGatewayv2PermissionInstance = InstanceType<
  typeof LambdaApiGatewayv2Permission
>;
