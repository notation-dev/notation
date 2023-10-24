import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda";

export type FnConfig = any;

export type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export const handle = {
  apiGateway: (handler: ApiGatewayHandler): ApiGatewayHandler => handler,
};
