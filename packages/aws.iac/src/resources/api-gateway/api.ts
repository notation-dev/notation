import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";

export type ApiSchema = {
  create: {
    input: sdk.CreateApiCommandInput;
    output: sdk.CreateApiCommandOutput;
  };
  read: {
    input: sdk.GetApiCommandInput;
    output: sdk.GetApiCommandOutput;
  };
  update: {
    input: sdk.UpdateApiCommandInput;
    output: sdk.UpdateApiCommandOutput;
  };
  delete: {
    input: sdk.DeleteApiCommandInput;
    output: sdk.DeleteApiCommandOutput;
  };
};

const createApiClass = createResourceFactory<ApiSchema>();

export const Api = createApiClass({
  type: "aws/api-gateway",
  idKey: "ApiId",

  async create(input) {
    const command = new sdk.CreateApiCommand(input);
    return apiGatewayClient.send(command);
  },

  async read(input) {
    const command = new sdk.GetApiCommand(input);
    return apiGatewayClient.send(command);
  },

  async update(input) {
    const command = new sdk.UpdateApiCommand(input);
    return apiGatewayClient.send(command);
  },

  async delete(input) {
    const command = new sdk.DeleteApiCommand(input);
    return apiGatewayClient.send(command);
  },
});

export type ApiInstance = InstanceType<typeof Api>;
