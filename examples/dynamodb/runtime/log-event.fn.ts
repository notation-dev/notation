import { $config, handle } from "@notation/aws/lambda.fn";
import * as dynamo from "@notation/aws/dynamodb.fn";
import { messagesTable } from "infra/messages";

export const logEvent = handle.eventBridgeScheduledEvent((event) => {
  // put item into dynamodb
});

export default $config({
  service: "aws/lambda",
  timeout: 5,
  memory: 1024,
  policies: [
    dynamo.$policy({
      table: messagesTable,
      actions: ["PutItem"],
    }),
  ],
});
