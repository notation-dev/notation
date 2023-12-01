import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { LambdaIamRoleInstance } from "./lambda-role";

export type LambdaRolePolicyAttachmentSchema = {
  input: sdk.AttachRolePolicyCommandInput;
  output: sdk.AttachRolePolicyCommandOutput;
  primaryKey: sdk.DetachRolePolicyCommandInput;
};

export type LambdaRolePolicyAttachmentDeps = { role: LambdaIamRoleInstance };

const createLambdaRolePolicyAttachmentClass = createResourceFactory<
  LambdaRolePolicyAttachmentSchema,
  LambdaRolePolicyAttachmentDeps
>();

export const LambdaRolePolicyAttachment = createLambdaRolePolicyAttachmentClass(
  {
    type: "aws/lambda/LambdaRolePolicyAttachment",

    getPrimaryKey: (input) => ({
      RoleName: input.RoleName,
      PolicyArn: input.PolicyArn,
    }),

    getIntrinsicInput: (dependencies) => ({
      RoleName: dependencies.role.output.RoleName,
    }),

    create: async (input) => {
      const command = new sdk.AttachRolePolicyCommand(input);
      return iamClient.send(command);
    },

    delete: async (pk) => {
      const command = new sdk.DetachRolePolicyCommand(pk);
      return iamClient.send(command);
    },
  },
);

export type LambdaRolePolicyAttachmentInstance = InstanceType<
  typeof LambdaRolePolicyAttachment
>;
