import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { lambdaTrustPolicy } from "src/templates/iam.policy";

export type LambdaIamRoleSchema = {
  create: {
    input: sdk.CreateRoleCommandInput;
    output: sdk.CreateRoleCommandOutput;
  };
  read: {
    input: sdk.GetRoleCommandInput;
    output: sdk.GetRoleCommandOutput;
  };
  update: {
    input: sdk.UpdateRoleCommandInput;
    output: sdk.UpdateRoleCommandOutput;
  };
  delete: {
    input: sdk.DeleteRoleCommandInput;
    output: sdk.DeleteRoleCommandOutput;
  };
};

const createLambdaIamRoleClass = createResourceFactory<LambdaIamRoleSchema>();

export const LambdaIamRole = createLambdaIamRoleClass({
  type: "aws/lambda/role",
  idKey: "RoleName",

  getIntrinsicConfig: () => ({
    AssumeRolePolicyDocument: JSON.stringify(lambdaTrustPolicy),
  }),

  create: async (input) => {
    const command = new sdk.CreateRoleCommand(input);
    return iamClient.send(command);
  },

  read: async (input) => {
    const command = new sdk.GetRoleCommand(input);
    return iamClient.send(command);
  },

  update: async (input) => {
    const command = new sdk.UpdateRoleCommand(input);
    return iamClient.send(command);
  },

  delete: async (input) => {
    const command = new sdk.DeleteRoleCommand(input);
    return iamClient.send(command);
  },
});

export type LambdaIamRoleInstance = InstanceType<typeof LambdaIamRole>;
