import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import * as z from "zod";
import { iamClient } from "src/utils/aws-clients";
import { AwsSchema } from "src/utils/types";

export type LambdaRolePolicyAttachmentSchema = AwsSchema<{
  Key: sdk.DetachRolePolicyRequest;
  CreateParams: sdk.AttachRolePolicyRequest;
}>;

const lambdaRolePolicyAttachment = resource<LambdaRolePolicyAttachmentSchema>({
  type: "aws/lambda/LambdaRolePolicyAttachment",
});

const lambdaRolePolicyAttachmentSchema =
  lambdaRolePolicyAttachment.defineSchema({
    RoleName: {
      valueType: z.string(),
      propertyType: "primaryKey",
      presence: "required",
    },
    PolicyArn: {
      valueType: z.string(),
      propertyType: "primaryKey",
      presence: "required",
    },
  });

export const LambdaRolePolicyAttachment =
  lambdaRolePolicyAttachmentSchema.defineOperations({
    create: async (params) => {
      const command = new sdk.AttachRolePolicyCommand(params);
      await iamClient.send(command);
    },
    delete: async (key) => {
      const command = new sdk.DetachRolePolicyCommand(key);
      await iamClient.send(command);
    },
  });

export type LambdaRolePolicyAttachmentInstance = InstanceType<
  typeof LambdaRolePolicyAttachment
>;
