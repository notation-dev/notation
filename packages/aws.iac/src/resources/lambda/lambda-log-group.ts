import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-cloudwatch-logs";
import * as z from "zod";
import { cloudWatchLogsClient } from "src/utils/aws-clients";
import { AwsSchema } from "src/utils/types";
import { LambdaFunctionInstance } from "../lambda";

export type LambdaLogGroupSchema = AwsSchema<{
  Key: sdk.DeleteLogGroupRequest;
  CreateParams: sdk.CreateLogGroupRequest & sdk.PutRetentionPolicyRequest;
}>;

export type LambdaLogGroupDeps = { lambda: LambdaFunctionInstance };

const lambdaLogGroup = resource<LambdaLogGroupSchema>({
  type: "aws/lambda/LambdaLogGroup",
});

const lambdaLogGroupSchema = lambdaLogGroup.defineSchema({
  logGroupName: {
    valueType: z.string(),
    propertyType: "primaryKey",
    presence: "required",
  },
  kmsKeyId: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  tags: {
    valueType: z.record(z.string()),
    propertyType: "param",
    presence: "optional",
  },
  retentionInDays: {
    valueType: z.number(),
    propertyType: "param",
    presence: "required",
  },
});

export const LambdaLogGroup = lambdaLogGroupSchema
  .implement({
    create: async (params) => {
      const command = new sdk.CreateLogGroupCommand(params);
      await cloudWatchLogsClient.send(command);
      const retentionCommand = new sdk.PutRetentionPolicyCommand({
        logGroupName: params.logGroupName,
        retentionInDays: params.retentionInDays,
      });
      await cloudWatchLogsClient.send(retentionCommand);
    },
    update: async (key, params) => {
      const command = new sdk.PutRetentionPolicyCommand({ ...key, ...params });
      await cloudWatchLogsClient.send(command);
    },
    delete: async (key) => {
      const command = new sdk.DeleteLogGroupCommand(key);
      await cloudWatchLogsClient.send(command);
    },
  })
  .withIntrinsicConfig<LambdaLogGroupDeps>((dependencies) => ({
    logGroupName: `/aws/lambda/${dependencies.lambda.output.FunctionName}`,
  }));

export type LambdaLogGroupInstance = InstanceType<typeof LambdaLogGroup>;
