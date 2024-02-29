import * as dynamodb from "@notation/aws/dynamodb";

export const messagesTable = dynamodb.table({
  name: "messages",
  partitionKey: { name: "id", type: "string" },
  sortKey: { name: "timestamp", type: "string" },
  billingMode: "PAY_PER_REQUEST",
});
