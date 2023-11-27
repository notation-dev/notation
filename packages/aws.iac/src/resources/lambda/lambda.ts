import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import { LambdaIamRoleInstance, LambdaRolePolicyAttachmentInstance } from "./";
import { ZipFileInstance } from "@notation/std.iac";
import { lambdaClient } from "src/utils/aws-clients";

export type LambdaSchema = {
  create: {
    input: sdk.CreateFunctionCommandInput;
    output: sdk.CreateFunctionCommandOutput;
  };
  read: {
    input: sdk.GetFunctionCommandInput;
    output: NonNullable<sdk.GetFunctionCommandOutput["Configuration"]>;
  };
  update: {
    input: sdk.UpdateFunctionCodeCommandInput;
    output: sdk.UpdateFunctionCodeCommandOutput;
  };
  delete: {
    input: sdk.DeleteFunctionCommandInput;
    output: sdk.DeleteFunctionCommandOutput;
  };
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
  idKey: "FunctionName",
  retryOn: ["InvalidParameterValueException"],

  getIntrinsicConfig: (dependencies) => ({
    PackageType: "Zip",
    Code: { ZipFile: dependencies.zipFile.output.contents },
    Role: dependencies.role.output.Role!.Arn,
  }),

  create: async (input) => {
    const command = new sdk.CreateFunctionCommand(input);
    return lambdaClient.send(command);
  },

  read: async (input) => {
    const command = new sdk.GetFunctionCommand(input);
    const result = await lambdaClient.send(command);
    return result.Configuration!;
  },

  update: async (input) => {
    const command = new sdk.UpdateFunctionCodeCommand(input);
    return lambdaClient.send(command);
  },

  delete: async (input) => {
    const command = new sdk.DeleteFunctionCommand(input);
    return lambdaClient.send(command);
  },
});

export type LambdaInstance = InstanceType<typeof Lambda>;
