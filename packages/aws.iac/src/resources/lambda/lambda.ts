import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-lambda";
import * as z from "zod";
import { lambdaClient } from "src/utils/aws-clients";
import { AwsSchema } from "src/utils/types";

export type LambdaFunctionSchema = AwsSchema<{
  Key: Omit<sdk.GetFunctionRequest, "Qualifier">;
  CreateParams: sdk.CreateFunctionRequest & sdk.PutFunctionConcurrencyRequest;
  UpdateParams: sdk.UpdateFunctionCodeRequest &
    sdk.UpdateFunctionConfigurationRequest &
    sdk.PutFunctionConcurrencyRequest &
    sdk.PutFunctionCodeSigningConfigRequest;
  ReadResult: sdk.GetFunctionResponse["Code"] &
    sdk.GetFunctionResponse["Configuration"] &
    sdk.GetFunctionResponse["Concurrency"];
}>;

const lambdaFunction = resource<LambdaFunctionSchema>({
  type: "aws/lambda/LambdaFunction",
});

const lambdaFunctionSchema = lambdaFunction.defineSchema({
  FunctionName: {
    valueType: z.string(),
    propertyType: "primaryKey",
    presence: "required",
    userManaged: true,
  },
  Architectures: {
    valueType: z.array(z.enum(["x86_64", "arm64"])),
    propertyType: "param",
    presence: "optional",
  },
  Code: {
    valueType: z.object({
      S3Bucket: z.string().optional(),
      S3Key: z.string().optional(),
      S3ObjectVersion: z.string().optional(),
      ZipFile: z.any().optional(),
    }),
    propertyType: "param",
    presence: "required",
    immutable: true,
  },
  CodeSigningConfigArn: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  CodeSigningPolicies: {
    valueType: z.object({
      UntrustedArtifactOnDeployment: z.enum(["Warn", "Enforce"]),
    }),
    propertyType: "param",
    presence: "optional",
  },
  CodeSigningPolicy: {
    valueType: z.enum(["Warn", "Enforce"]),
    propertyType: "param",
    presence: "optional",
  },
  DeadLetterConfig: {
    valueType: z.object({
      TargetArn: z.string(),
    }),
    propertyType: "param",
    presence: "optional",
  },
  Description: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  EphemeralStorage: {
    valueType: z.object({
      Size: z.number(),
    }),
    propertyType: "param",
    presence: "optional",
  },
  Environment: {
    valueType: z.object({
      Variables: z.record(z.string()),
    }),
    propertyType: "param",
    presence: "optional",
  },
  FileSystemConfigs: {
    valueType: z.array(
      z.object({
        Arn: z.string(),
        LocalMountPath: z.string(),
      }),
    ),
    propertyType: "param",
    presence: "optional",
  },
  FunctionArn: {
    valueType: z.string(),
    propertyType: "computed",
    presence: "required",
  },
  Handler: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  ImageConfig: {
    valueType: z.object({
      Command: z.array(z.string()),
      EntryPoint: z.array(z.string()),
      WorkingDirectory: z.string(),
    }),
    propertyType: "param",
    presence: "optional",
  },
  ImageUri: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  KMSKeyArn: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  Layers: {
    valueType: z.array(z.string()),
    propertyType: "param",
    presence: "optional",
  },
  LoggingConfig: {
    valueType: z.object({
      LogFormat: z.enum(["JSON", "Text"]),
      ApplicationLogLevel: z.enum([
        "WARN",
        "DEBUG",
        "ERROR",
        "FATAL",
        "INFO",
        "TRACE",
      ]),
      SystemLogLevel: z.enum(["WARN", "DEBUG", "INFO"]),
      LogGroup: z.string(),
    }),
    propertyType: "param",
    presence: "optional",
  },
  MemorySize: {
    valueType: z.number(),
    propertyType: "param",
    presence: "optional",
  },
  PackageType: {
    valueType: z.enum(["Zip", "Image"]),
    propertyType: "param",
    presence: "optional",
    immutable: true,
  },
  Publish: {
    valueType: z.boolean(),
    propertyType: "param",
    presence: "optional",
  },
  ReservedConcurrentExecutions: {
    valueType: z.number(),
    propertyType: "param",
    presence: "required",
  },
  Role: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
  },
  Runtime: {
    valueType: z.enum([
      "dotnet6",
      "dotnetcore1.0",
      "dotnetcore2.0",
      "dotnetcore2.1",
      "dotnetcore3.1",
      "go1.x",
      "java11",
      "java17",
      "java21",
      "java8",
      "java8.al2",
      "nodejs",
      "nodejs10.x",
      "nodejs12.x",
      "nodejs14.x",
      "nodejs16.x",
      "nodejs18.x",
      "nodejs20.x",
      "nodejs4.3",
      "nodejs4.3-edge",
      "nodejs6.10",
      "nodejs8.10",
      "provided",
      "provided.al2",
      "provided.al2023",
      "python2.7",
      "python3.10",
      "python3.11",
      "python3.12",
      "python3.6",
      "python3.7",
      "python3.8",
      "python3.9",
      "ruby2.5",
      "ruby2.7",
      "ruby3.2",
    ]),
    propertyType: "param",
    presence: "optional",
  },
  SigningConfigArn: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  SigningJobArn: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  SigningProfileVersionArn: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
  SnapStart: {
    valueType: z.object({
      ApplyOn: z.enum(["None", "PublishedVersions"]),
    }),
    propertyType: "param",
    presence: "optional",
  },
  State: {
    valueType: z.enum(["Active", "Pending", "Inactive", "Failed"]),
    propertyType: "computed",
    presence: "required",
  },
  Tags: {
    valueType: z.record(z.string()),
    propertyType: "param",
    presence: "optional",
    immutable: true,
  },
  Timeout: {
    valueType: z.number(),
    propertyType: "param",
    presence: "optional",
  },
  TracingConfig: {
    valueType: z.object({
      Mode: z.enum(["Active", "PassThrough"]),
    }),
    propertyType: "param",
    presence: "optional",
  },
  VpcConfig: {
    valueType: z.object({
      SecurityGroupIds: z.array(z.string()),
      SubnetIds: z.array(z.string()),
    }),
    propertyType: "param",
    presence: "optional",
  },
});

export const LambdaFunction = lambdaFunctionSchema.defineOperations({
  create: async (params) => {
    const command = new sdk.CreateFunctionCommand(params);
    await lambdaClient.send(command);
  },
  read: async (key) => {
    const command = new sdk.GetFunctionCommand(key);
    const { Code, Configuration, Concurrency } =
      await lambdaClient.send(command);

    return {
      ...Configuration,
      Layers: Configuration!.Layers?.map((layer) => layer.Arn),
      ...Concurrency,
      Code: {
        S3Bucket: Code?.Location?.split("/")[0],
        S3Key: Code?.Location?.split("/")[1],
        S3ObjectVersion: Code?.Location?.split("/")[2],
        ZipFile: undefined,
      },
    };
  },
  update: async (key, params) => {
    const input = { ...key, ...params };
    const command = new sdk.UpdateFunctionConfigurationCommand(input);
    const codeCommand = new sdk.UpdateFunctionCodeCommand(input);
    await lambdaClient.send(codeCommand);
    await lambdaClient.send(command);
  },
  delete: async (key) => {
    const command = new sdk.DeleteFunctionCommand(key);
    await lambdaClient.send(command);
  },
});

export type LambdaFunctionInstance = InstanceType<typeof LambdaFunction>;
