import { createResourceFactory } from "@notation/core";
import {
  CreateFunctionCommand,
  CreateFunctionCommandInput,
  CreateFunctionCommandOutput,
} from "@aws-sdk/client-lambda";
import { LambdaIamRoleInstance, LambdaRolePolicyAttachmentInstance } from "./";
import { lambdaClient } from "src/utils/aws-clients";

export type LambdaInput = CreateFunctionCommandInput;
export type LambdaOutput = CreateFunctionCommandOutput;
export type LambdaDeps = { role: LambdaIamRoleInstance } & LambdaImplicitDeps;

type LambdaImplicitDeps = {
  policyAttachment: LambdaRolePolicyAttachmentInstance;
};

const createLambdaClass = createResourceFactory<
  LambdaInput,
  LambdaOutput,
  LambdaDeps
>();

export const Lambda = createLambdaClass({
  type: "aws/lambda",

  getIntrinsicConfig: (dependencies) => ({
    Role: dependencies.role.output.Role!.Arn,
  }),

  deploy: async (props: LambdaInput) => {
    const command = new CreateFunctionCommand(props);
    return lambdaClient.send(command);
  },

  retryOn: ["InvalidParameterValueException"],
});

export type LambdaInstance = InstanceType<typeof Lambda>;
