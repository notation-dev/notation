import { createResourceFactory } from "@notation/core";
import {
  CreateRoleCommand,
  CreateRoleCommandInput,
  CreateRoleCommandOutput,
  DeleteRoleCommand,
} from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { lambdaTrustPolicy } from "src/templates/iam.policy";

export type LambdaIamRoleInput = CreateRoleCommandInput;
export type LambdaIamRoleOutput = CreateRoleCommandOutput;

const createLambdaIamRoleClass = createResourceFactory<
  LambdaIamRoleInput,
  LambdaIamRoleOutput
>();

export const LambdaIamRole = createLambdaIamRoleClass({
  type: "aws/lambda/role",

  getIntrinsicConfig: () => ({
    AssumeRolePolicyDocument: JSON.stringify(lambdaTrustPolicy),
  }),

  deploy: async (config: LambdaIamRoleInput) => {
    const command = new CreateRoleCommand(config);
    return iamClient.send(command);
  },

  destroy: async (config: LambdaIamRoleInput) => {
    const { RoleName } = config;
    const command = new DeleteRoleCommand({ RoleName });
    return iamClient.send(command);
  },
});

export type LambdaIamRoleInstance = InstanceType<typeof LambdaIamRole>;
