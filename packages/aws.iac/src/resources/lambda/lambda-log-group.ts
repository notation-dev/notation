import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-cloudwatch-logs";
import { cloudWatchLogsClient } from "src/utils/aws-clients";
import { LambdaInstance } from "./lambda";

export type LambdaLogGroupSchema = {
  create: {
    input: sdk.CreateLogGroupCommandInput;
    output: sdk.CreateLogGroupCommandOutput;
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
    input: sdk.DeleteLogGroupCommandInput;
    output: sdk.DeleteLogGroupCommandOutput;
  };
};

export type LambdaLogGroupDeps = { lambda: LambdaInstance };

const createLambdaLogGroupClass = createResourceFactory<
  LambdaLogGroupSchema,
  LambdaLogGroupDeps
>();

export const LambdaLogGroup = createLambdaLogGroupClass({
  type: "aws/lambda/log-group",
  idKey: "logGroupName",

  getIntrinsicConfig: (dependencies) => ({
    logGroupName: `/aws/lambda/${dependencies.lambda.output.FunctionName}`,
  }),

  create: async (input) => {
    const command = new sdk.CreateLogGroupCommand(input);
    return cloudWatchLogsClient.send(command);
  },

  read: async () => {},
  update: async () => {},

  delete: async (input) => {
    const command = new sdk.DeleteLogGroupCommand(input);
    return cloudWatchLogsClient.send(command);
  },
});

export type LambdaLogGroupInstance = InstanceType<typeof LambdaLogGroup>;
