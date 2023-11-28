import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import { LambdaIamRoleInstance, LambdaRolePolicyAttachmentInstance } from "./";
import { ZipFileInstance } from "@notation/std.iac";
import { lambdaClient } from "src/utils/aws-clients";

export type LambdaSchema = {
  input: sdk.CreateFunctionCommandInput;
  output: NonNullable<sdk.GetFunctionCommandOutput["Configuration"]>;
  primaryKey: sdk.DeleteFunctionCommandInput;
};

type LambdaImplicitDeps = {
  policyAttachment: LambdaRolePolicyAttachmentInstance;
};

export type LambdaDeps = {
  role: LambdaIamRoleInstance;
  zipFile: ZipFileInstance;
};

const createLambdaClass = createResourceFactory<
  LambdaSchema,
  LambdaDeps & LambdaImplicitDeps
>();

export const Lambda = createLambdaClass({
  type: "aws/lambda",

  retryOn: [
    "InvalidParameterValueException: The role defined for the function cannot be assumed by Lambda",
  ],

  getPrimaryKey: (input) => ({
    FunctionName: input.FunctionName,
  }),

  getIntrinsicInput: (dependencies) => ({
    PackageType: "Zip",
    Code: { ZipFile: dependencies.zipFile.output.contents },
    Role: dependencies.role.output.Arn,
  }),

  create: async (input) => {
    const command = new sdk.CreateFunctionCommand(input);
    return lambdaClient.send(command);
  },

  read: async (pk) => {
    const command = new sdk.GetFunctionCommand(pk);
    const result = await lambdaClient.send(command);
    return result.Configuration!;
  },

  update: async (patch) => {
    const command = new sdk.UpdateFunctionCodeCommand(patch);
    return lambdaClient.send(command);
  },

  delete: async (pk) => {
    const command = new sdk.DeleteFunctionCommand(pk);
    return lambdaClient.send(command);
  },
});

export type LambdaInstance = InstanceType<typeof Lambda>;
