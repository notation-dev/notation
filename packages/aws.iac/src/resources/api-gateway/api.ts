import { createResourceFactory } from "@notation/core";
import * as sdk from "@aws-sdk/client-apigatewayv2";
import { apiGatewayClient } from "src/utils/aws-clients";

export type ApiSchema = {
  input: sdk.CreateApiCommandInput;
  output: sdk.GetApiCommandOutput;
  primaryKey: sdk.DeleteApiCommandInput;
};

const createApiClass = createResourceFactory<ApiSchema>();

export const Api = createApiClass({
  type: "aws/apiGateway/Api",

  getPrimaryKey: (input, output) => ({
    ApiId: output.ApiId,
  }),

  async create(input) {
    const command = new sdk.CreateApiCommand(input);
    return apiGatewayClient.send(command);
  },

  async read(pk) {
    const command = new sdk.GetApiCommand(pk);
    return apiGatewayClient.send(command);
  },

  async update(input) {
    const command = new sdk.UpdateApiCommand(input);
    return apiGatewayClient.send(command);
  },

  async delete(pk) {
    const command = new sdk.DeleteApiCommand(pk);
    return apiGatewayClient.send(command);
  },
});

export type ApiInstance = InstanceType<typeof Api>;
