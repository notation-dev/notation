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

export type LambdaLogGroupDependencies = { lambda: LambdaFunctionInstance };

const lambdaLogGroup = resource<LambdaLogGroupSchema>({
  type: "aws/lambda/LambdaLogGroup",
});

const lambdaLogGroupSchema = lambdaLogGroup.defineSchema({
  logGroupName: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
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
} as const);

export const LambdaLogGroup = lambdaLogGroupSchema
  .defineOperations({
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
  .requireDependencies<LambdaLogGroupDependencies>()
  .setIntrinsicConfig(({ deps }) => ({
    logGroupName: `/aws/lambda/${deps.lambda.output.FunctionName}`,
  }));

export type LambdaLogGroupInstance = InstanceType<typeof LambdaLogGroup>;
