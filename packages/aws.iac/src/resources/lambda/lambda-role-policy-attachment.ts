import { createResourceFactory } from "@notation/core";
import {
  AttachRolePolicyCommand,
  AttachRolePolicyCommandInput,
  AttachRolePolicyCommandOutput,
} from "@aws-sdk/client-iam";
import { iamClient } from "src/utils/aws-clients";
import { LambdaIamRoleInstance } from "./lambda-role";

export type LambdaRolePolicyAttachmentInput = AttachRolePolicyCommandInput;
export type LambdaRolePolicyAttachmentOutput = AttachRolePolicyCommandOutput;
export type LambdaRolePolicyAttachmentDeps = { role: LambdaIamRoleInstance };

const createLambdaRolePolicyAttachmentClass = createResourceFactory<
  LambdaRolePolicyAttachmentInput,
  LambdaRolePolicyAttachmentOutput,
  LambdaRolePolicyAttachmentDeps
>();

export const LambdaRolePolicyAttachment = createLambdaRolePolicyAttachmentClass(
  {
    type: "aws/lambda/policy-attachment",

    getIntrinsicConfig: (dependencies) => ({
      RoleName: dependencies.role.output.Role!.RoleName,
    }),

    deploy: async (props: LambdaRolePolicyAttachmentInput) => {
      const command = new AttachRolePolicyCommand(props);
      return iamClient.send(command);
    },
  },
);

export type LambdaRolePolicyAttachmentInstance = InstanceType<
  typeof LambdaRolePolicyAttachment
>;
