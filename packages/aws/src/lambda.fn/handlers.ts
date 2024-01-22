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
} from "src/shared/lambda.handler";

export const handle = {
  apiRequest:
    (handler: ApiGatewayHandler): ApiGatewayHandler =>
    async (...args) =>
      handler(...args),

  jwtAuthorizedApiRequest: (
    handler: JWTAuthorizedApiGatewayHandler,
  ): ApiGatewayHandler => toApiGatewayHandler(handler),

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

const toApiGatewayHandler = (
  handler: JWTAuthorizedApiGatewayHandler,
): ApiGatewayHandler => {
  const apiGatewayHandler: ApiGatewayHandler = (
    event: APIGatewayProxyEventV2,
    context: Context,
  ) => {
    const authorizationHeader = event.headers.Authorization!;

    // Remove the 'Bearer ' prefix that preceeds the token itself
    const jwtToken = authorizationHeader?.slice(7);
    const jwt = decomposeUnverifiedJwt(jwtToken);

    const eventWithJwt = {
      token: jwt.payload,
      event: event,
    };

    return handler(eventWithJwt, context);
  };

  return apiGatewayHandler;
};
