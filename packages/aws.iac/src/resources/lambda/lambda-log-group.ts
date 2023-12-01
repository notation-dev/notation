import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-cloudwatch-logs";
import { cloudWatchLogsClient } from "src/utils/aws-clients";
import { LambdaInstance } from "./lambda";

export type LambdaLogGroupSchema = {
  input: sdk.CreateLogGroupCommandInput;
  output: sdk.CreateLogGroupCommandOutput;
  primaryKey: sdk.DeleteLogGroupCommandInput;
};

export type LambdaLogGroupDeps = { lambda: LambdaInstance };

const createLambdaLogGroupClass = createResourceFactory<
  LambdaLogGroupSchema,
  LambdaLogGroupDeps
>();

export const LambdaLogGroup = createLambdaLogGroupClass({
  type: "aws/lambda/LambdaLogGroup",

  getPrimaryKey: (input) => ({
    logGroupName: input.logGroupName,
  }),

  getIntrinsicInput: (dependencies) => ({
    logGroupName: `/aws/lambda/${dependencies.lambda.output.FunctionName}`,
  }),

  create: async (input) => {
    const command = new sdk.CreateLogGroupCommand(input);
    return cloudWatchLogsClient.send(command);
  },

  delete: async (pk) => {
    const command = new sdk.DeleteLogGroupCommand(pk);
    return cloudWatchLogsClient.send(command);
  },
});

export type LambdaLogGroupInstance = InstanceType<typeof LambdaLogGroup>;
