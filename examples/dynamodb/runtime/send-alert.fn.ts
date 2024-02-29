import { $config, handle } from "@notation/aws/lambda.fn";
import * as dynamo from "@notation/aws/dynamodb.fn";
import { messagesTable } from "infra/messages";

const messagesTableClient = dynamo.$client({
  table: messagesTable,
  allowedMethods: ["PutItem"],
});

export const logEvent = handle.eventBridgeScheduledEvent(async (event) => {
  await messagesTableClient.PutItem({
    Item: {
      id: { S: "alert" },
      message: { S: "Alert!" },
    },
  });
});

export default $config({
  service: "aws/lambda",
  timeout: 5,
  memory: 1024,
});
