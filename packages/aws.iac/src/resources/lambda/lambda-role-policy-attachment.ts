import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { LambdaIamRoleInstance } from "./lambda-role";

export type LambdaRolePolicyAttachmentSchema = {
  create: {
    input: sdk.AttachRolePolicyCommandInput;
    output: sdk.AttachRolePolicyCommandOutput;
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
    input: sdk.DetachRolePolicyCommandInput;
    output: sdk.DetachRolePolicyCommandOutput;
  };
};

export type LambdaRolePolicyAttachmentDeps = { role: LambdaIamRoleInstance };

const createLambdaRolePolicyAttachmentClass = createResourceFactory<
  LambdaRolePolicyAttachmentSchema,
  LambdaRolePolicyAttachmentDeps
>();

export const LambdaRolePolicyAttachment = createLambdaRolePolicyAttachmentClass(
  {
    type: "aws/lambda/policy-attachment",
    idKey: "PolicyArn",

    getIntrinsicConfig: (dependencies) => ({
      RoleName: dependencies.role.output.Role!.RoleName,
    }),

    create: async (input) => {
      const command = new sdk.AttachRolePolicyCommand(input);
      return iamClient.send(command);
    },

    read: async () => {},
    update: async () => {},

    delete: async (input) => {
      const command = new sdk.DetachRolePolicyCommand(input);
      return iamClient.send(command);
    },
  },
);

export type LambdaRolePolicyAttachmentInstance = InstanceType<
  typeof LambdaRolePolicyAttachment
>;
