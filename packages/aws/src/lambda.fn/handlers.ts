import type { ApiGatewayHandler, EventBridgeHandler } from "src/shared/lambda.handler";

export const handle = {
  apiRequest:
    (handler: ApiGatewayHandler): ApiGatewayHandler =>
    async (...args) =>
      handler(...args),
  eventBridgeScheduledEvent: 
    (handler: EventBridgeHandler<"Scheduled Event", any>): EventBridgeHandler<"Scheduled Event", any> =>
    async(...args) => handler(...args)
};
