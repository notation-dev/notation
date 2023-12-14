import type {
  ApiGatewayHandler,
  DynamoDbBatchHandler,
  DynamoDbStreamHandler,
  SqsBatchHandler,
  SqsHandler,
  EventBridgeHandler
} from "src/shared/lambda.handler";

export const handle = {
  apiRequest:
    (handler: ApiGatewayHandler): ApiGatewayHandler =>
    async (...args) =>
      handler(...args),
  eventBridgeScheduledEvent: 
    (handler: EventBridgeHandler<"Scheduled Event", any>): EventBridgeHandler<"Scheduled Event", any> =>
    async(...args) => handler(...args),
  dynamoDbStream:
    (handler: DynamoDbStreamHandler): DynamoDbStreamHandler =>
    async (...args) =>
      handler(...args),
  dynamoDbBatch:
    (handler: DynamoDbBatchHandler): DynamoDbBatchHandler =>
    async (...args) =>
      handler(...args),
  sqsEvent:
    (handler: SqsHandler): SqsHandler =>
    async (...args) =>
      handler(...args),
  sqsBatch:
    (handler: SqsBatchHandler): SqsBatchHandler =>
    async (...args) =>
      handler(...args),
};
