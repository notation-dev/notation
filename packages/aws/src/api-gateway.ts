import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { registerResource } from "@notation/core";

export type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export type ApiOptions = {
  name: string;
};

export const api = (apiOpts: ApiOptions) => {
  const apiResource = registerResource("api", apiOpts);
  return {
    get: (path: string, handler: ApiGatewayHandler) => {
      registerResource("api-route", {
        api: apiResource.id,
        service: "aws/api-gateway",
        path,
        method: "GET",
        // @ts-ignore – property exists at runtime
        handler: handler.id,
      });
    },
  };
};

export const handler = (handler: ApiGatewayHandler): ApiGatewayHandler =>
  handler;

export const json = (result: any) => ({
  body: JSON.stringify(result),
  statusCode: 200,
});
