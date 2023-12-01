import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { lambdaTrustPolicy } from "src/templates/iam.policy";

export type LambdaIamRoleSchema = {
  input: sdk.CreateRoleCommandInput;
  output: NonNullable<sdk.GetRoleCommandOutput["Role"]>;
  primaryKey: sdk.DeleteRoleCommandInput;
};

const createLambdaIamRoleClass = createResourceFactory<LambdaIamRoleSchema>();

export const LambdaIamRole = createLambdaIamRoleClass({
  type: "aws/lambda/LambdaIamRole",

  getPrimaryKey: (input) => ({
    RoleName: input.RoleName,
  }),

  getIntrinsicInput: () => ({
    AssumeRolePolicyDocument: JSON.stringify(lambdaTrustPolicy),
  }),

  create: async (input) => {
    const command = new sdk.CreateRoleCommand(input);
    const result = await iamClient.send(command);
    return result.Role!;
  },

  read: async (pk) => {
    const command = new sdk.GetRoleCommand(pk);
    const result = await iamClient.send(command);
    return result.Role!;
  },

  update: async (patch) => {
    const command = new sdk.UpdateRoleCommand({
      RoleName: patch.RoleName,
      Description: patch.Description,
      MaxSessionDuration: patch.MaxSessionDuration,
    });
    await iamClient.send(command);
  },

  delete: async (pk) => {
    const command = new sdk.DeleteRoleCommand(pk);
    return iamClient.send(command);
  },
});

export type LambdaIamRoleInstance = InstanceType<typeof LambdaIamRole>;
