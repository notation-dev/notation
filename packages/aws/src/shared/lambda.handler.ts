import type {
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  DynamoDBStreamEvent,
  DynamoDBBatchResponse,
  SQSEvent,
  SQSBatchResponse,
} from "aws-lambda";

export type ApiGatewayHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export type DynamoDbStreamHandler = (
  event: DynamoDBStreamEvent,
  context: Context,
) => void | Promise<void>;

export type DynamoDbBatchHandler = (
  event: DynamoDBBatchResponse,
  context: Context,
) => void | Promise<void>;

export type SqsHandler = (
  event: SQSEvent,
  context: Context,
) => void | Promise<void>;

export type SqsBatchHandler = (
  event: SQSBatchResponse,
  context: Context,
) => void | Promise<void>;
