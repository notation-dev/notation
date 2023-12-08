import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-iam";
import * as z from "zod";
import { iamClient } from "src/utils/aws-clients";
import { AwsSchema } from "src/utils/types";
import { lambdaTrustPolicy } from "src/templates/iam.policy";

export type LambdaIamRoleSchema = AwsSchema<{
  Key: sdk.DeleteRoleRequest;
  CreateParams: sdk.CreateRoleRequest;
  UpdateParams: sdk.UpdateRoleRequest;
  ReadResult: sdk.GetRoleResponse["Role"];
}>;

const lambdaIamRole = resource<LambdaIamRoleSchema>({
  type: "aws/lambda/LambdaIamRole",
});

const lambdaIamRoleSchema = lambdaIamRole.defineSchema({
  RoleName: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
  },
  AssumeRolePolicyDocument: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
  },
  Description: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  MaxSessionDuration: {
    valueType: z.number(),
    propertyType: "param",
    presence: "optional",
  },
  Path: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  PermissionsBoundary: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
} as const);

export const LambdaIamRole = lambdaIamRoleSchema.defineOperations({
  create: async (params) => {
    const command = new sdk.CreateRoleCommand(params);
    await iamClient.send(command);
  },
  read: async (key) => {
    const command = new sdk.GetRoleCommand(key);
    return await iamClient.send(command);
  },
  update: async (key, params) => {
    const command = new sdk.UpdateRoleCommand({ ...key, ...params });
    await iamClient.send(command);
  },
  delete: async (key) => {
    const command = new sdk.DeleteRoleCommand({ RoleName: key.RoleName });
    await iamClient.send(command);
  },
  setIntrinsicConfig: () => ({
    AssumeRolePolicyDocument: JSON.stringify(lambdaTrustPolicy),
  }),
});

export type LambdaIamRoleInstance = InstanceType<typeof LambdaIamRole>;
