import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { ApiInstance } from "./api";

export type StageSchema = {
  create: {
    input: sdk.CreateStageCommandInput;
    output: sdk.CreateStageCommandOutput;
  };
  read: {
    input: sdk.GetStageCommandInput;
    output: sdk.GetStageCommandOutput;
  };
  update: {
    input: sdk.UpdateStageCommandInput;
    output: sdk.UpdateStageCommandOutput;
  };
  delete: {
    input: sdk.DeleteStageCommandInput;
    output: sdk.DeleteStageCommandOutput;
  };
};

export type StageDependencies = { api: ApiInstance };

const createStageClass = createResourceFactory<
  StageSchema,
  StageDependencies
>();

export const Stage = createStageClass({
  type: "aws/api-gateway/stage",
  idKey: "StageName",

  getIntrinsicConfig: (dependencies) => ({
    ApiId: dependencies.api.output.ApiId,
  }),

  create: async (input) => {
    const command = new sdk.CreateStageCommand(input);
    return apiGatewayClient.send(command);
  },

  read: async (input) => {
    const command = new sdk.GetStageCommand(input);
    return apiGatewayClient.send(command);
  },

  update: async (input) => {
    const command = new sdk.UpdateStageCommand(input);
    return apiGatewayClient.send(command);
  },

  delete: async (input) => {
    const command = new sdk.DeleteStageCommand(input);
    return apiGatewayClient.send(command);
  },
});

export type StageInstance = InstanceType<typeof Stage>;
