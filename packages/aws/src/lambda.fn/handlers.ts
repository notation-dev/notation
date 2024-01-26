import { decomposeUnverifiedJwt } from "aws-jwt-verify/jwt";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import type {
  ApiGatewayHandler,
  DynamoDbBatchHandler,
  DynamoDbStreamHandler,
  SqsBatchHandler,
  SqsHandler,
  EventBridgeHandler,
  JWTAuthorizedApiGatewayHandler,
  APIGatewayProxyEventV2WithJWTAuthorizerWithTypedClaims,
} from "src/shared/lambda.handler";

export const handle = {
  apiRequest:
    (handler: ApiGatewayHandler): ApiGatewayHandler =>
    async (...args) =>
      handler(...args),
  jwtAuthorizedApiRequest: <T>(
    handler: JWTAuthorizedApiGatewayHandler<T>,
  ): JWTAuthorizedApiGatewayHandler<T> => handler,
  eventBridgeScheduledEvent:
    (
      handler: EventBridgeHandler<"Scheduled Event", any>,
    ): EventBridgeHandler<"Scheduled Event", any> =>
    async (...args) =>
      handler(...args),
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
