import { createResourceFactory } from "@notation/core";
import {
  CreateLogGroupCommand,
  CreateLogGroupCommandInput,
  CreateLogGroupCommandOutput,
} from "@aws-sdk/client-cloudwatch-logs";
import { cloudWatchLogsClient } from "src/utils/aws-clients";
import { LambdaInstance } from "./lambda";

export type LambdaLogGroupInput = CreateLogGroupCommandInput;
export type LambdaLogGroupOutput = CreateLogGroupCommandOutput;
export type LambdaLogGroupDeps = { lambda: LambdaInstance };

const createLambdaLogGroupClass = createResourceFactory<
  LambdaLogGroupInput,
  LambdaLogGroupOutput,
  LambdaLogGroupDeps
>();

export const LambdaLogGroup = createLambdaLogGroupClass({
  type: "aws/lambda/log-group",

  getIntrinsicConfig: (dependencies) => ({
    logGroupName: `/aws/lambda/${dependencies.lambda.output.FunctionName}`,
  }),

  create: async (props: LambdaLogGroupInput) => {
    const command = new CreateLogGroupCommand(props);
    return cloudWatchLogsClient.send(command);
  },
});

export type LambdaLogGroupInstance = InstanceType<typeof LambdaLogGroup>;
