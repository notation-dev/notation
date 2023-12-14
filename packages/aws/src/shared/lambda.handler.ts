import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  EventBridgeEvent,
} from "aws-lambda";

export type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export type EventBridgeHandler<TypeDescription extends string, DetailType> 
  = (event: EventBridgeEvent<TypeDescription, DetailType>, context: Context) => void | Promise<void>

export type EventBridgeScheduleHandler = EventBridgeHandler<"Scheduled Event", any>