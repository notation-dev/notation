import { JwtPayload } from "aws-jwt-verify/jwt-model";
import type {
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  EventBridgeEvent,
  DynamoDBStreamEvent,
  DynamoDBBatchResponse,
  SQSEvent,
  SQSBatchResponse,
} from "aws-lambda";

export type ApiGatewayHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export type EventWithJWTToken = {
  event: APIGatewayProxyEventV2;
  token: JwtPayload;
};

export type JWTAuthorizedApiGatewayHandler = (
  event: EventWithJWTToken,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export type EventBridgeHandler<TypeDescription extends string, DetailType> = (
  event: EventBridgeEvent<TypeDescription, DetailType>,
  context: Context,
) => void | Promise<void>;

export type EventBridgeScheduleHandler = EventBridgeHandler<
  "Scheduled Event",
  any
>;
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
