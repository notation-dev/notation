import { createResourceFactory } from "@notation/core";
import {
  CreateFunctionCommand,
  CreateFunctionCommandInput,
  CreateFunctionCommandOutput,
} from "@aws-sdk/client-lambda";
import { LambdaIamRoleInstance, LambdaRolePolicyAttachmentInstance } from "./";
import { ZipFileInstance } from "@notation/std.iac";
import { lambdaClient } from "src/utils/aws-clients";

export type LambdaInput = CreateFunctionCommandInput;
export type LambdaOutput = CreateFunctionCommandOutput;

type LambdaImplicitDeps = {
  policyAttachment: LambdaRolePolicyAttachmentInstance;
};

export type LambdaDeps = {
  role: LambdaIamRoleInstance;
  zipFile: ZipFileInstance;
};

const createLambdaClass = createResourceFactory<
  LambdaInput,
  LambdaOutput,
  LambdaDeps & LambdaImplicitDeps
>();

export const Lambda = createLambdaClass({
  type: "aws/lambda",

  getIntrinsicConfig: (dependencies) => ({
    PackageType: "Zip",
    Code: { ZipFile: dependencies.zipFile.output.contents },
    Role: dependencies.role.output.Role!.Arn,
  }),

  deploy: async (props: LambdaInput) => {
    const command = new CreateFunctionCommand(props);
    return lambdaClient.send(command);
  },

  retryOn: ["InvalidParameterValueException"],
});

export type LambdaInstance = InstanceType<typeof Lambda>;
