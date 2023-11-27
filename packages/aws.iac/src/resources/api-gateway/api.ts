import { createResourceFactory } from "@notation/core";
import {
  CreateApiCommand,
  CreateApiCommandInput,
  CreateApiCommandOutput,
} from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";

export type ApiInput = CreateApiCommandInput;
export type ApiOutput = CreateApiCommandOutput;

const createApiClass = createResourceFactory<ApiInput, ApiOutput>();

export const Api = createApiClass({
  type: "aws/api-gateway",

  async create(props: ApiInput) {
    const command = new CreateApiCommand(props);
    return apiGatewayClient.send(command);
  },
});

export type ApiInstance = InstanceType<typeof Api>;
