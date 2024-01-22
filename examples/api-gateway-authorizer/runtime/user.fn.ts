import type { LambdaConfig } from "@notation/aws/lambda.fn";
import { handle, json } from "@notation/aws/lambda.fn";
import { EventWithJWTToken } from "@notation/aws/shared";
import { Context } from "aws-lambda";

export const getUserHandler = handle.jwtAuthorizedApiRequest(
  (event: EventWithJWTToken, context: Context) => {
    return json({ userId: "" });
  },
);

export const config: LambdaConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
