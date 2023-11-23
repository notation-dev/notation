import type { ApiGatewayHandler } from "src/shared/lambda.handler";

export const handle = {
  apiRequest:
    (handler: ApiGatewayHandler): ApiGatewayHandler =>
    async (...args) =>
      handler(...args),
};
