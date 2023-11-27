import { createResourceFactory } from "@notation/core";
import {
  CreateStageCommand,
  CreateStageCommandInput,
  CreateStageCommandOutput,
} from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";
import { Api } from "./api";

export type StageInput = CreateStageCommandInput;
export type StageOutput = CreateStageCommandOutput;
export type StageDependencies = { router: InstanceType<typeof Api> };

const createStageClass = createResourceFactory<
  StageInput,
  StageOutput,
  StageDependencies
>();

export const Stage = createStageClass({
  type: "aws/api-gateway/stage",

  getIntrinsicConfig: (dependencies) => ({
    ApiId: dependencies.router.output.ApiId,
  }),

  async create(props: StageInput) {
    const command = new CreateStageCommand(props);
    return apiGatewayClient.send(command);
  },
});

export type StageInstance = InstanceType<typeof Stage>;
