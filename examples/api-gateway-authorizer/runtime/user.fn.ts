import type { LambdaConfig } from "@notation/aws/lambda.fn";
import { handle, json } from "@notation/aws/lambda.fn";
import {
  JWTAuthorizedApiGatewayHandler,
  EventWithJWTToken,
} from "@notation/aws/shared";
import { Context } from "aws-lambda";

export const getUserHandler: JWTAuthorizedApiGatewayHandler =
  handle.jwtAuthorizedApiRequest(
    (event: EventWithJWTToken, context: Context) => {
      return json({ userId: "" });
    },
  );

export const config: LambdaConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
