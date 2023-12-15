import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-eventbridge";
import { AwsSchema } from "src/utils/types";
import z from "zod";
import { eventBridgeClient } from "src/utils/aws-clients";

export type EventBridgeBusSchema = AwsSchema<{
  Key: sdk.DescribeEventBusRequest;
  CreateParams: sdk.CreateEventBusRequest;
  ReadResult: sdk.DescribeEventBusResponse;
}>;

const eventBridgeBus = resource<EventBridgeBusSchema>({
  type: "aws/eventBridge/rule",
});

const eventBridgeBusSchema = eventBridgeBus.defineSchema({
  Name: {
    valueType: z.string(),
    propertyType: "param",
    presence: "required",
    primaryKey: true,
  },
  EventSourceName: {
    valueType: z.string(),
    propertyType: "param",
    presence: "optional",
  },
});

export const Bus = eventBridgeBusSchema.defineOperations({
  create: async (params) => {
    const command = new sdk.CreateEventBusCommand(params);
    await eventBridgeClient.send(command);
  },
  read: async (params) => {
    const command = new sdk.DescribeEventBusCommand(params);
    const result = await eventBridgeClient.send(command);
    return result;
  },
  delete: async (params) => {
    const command = new sdk.DeleteEventBusCommand(params);
    await eventBridgeClient.send(command);
  },
});
