import type { LambdaConfig } from "@notation/aws/lambda.fn";
import { handle, json } from "@notation/aws/lambda.fn";

export type JWTClaims = {
  iss: string;
  sub: string;
};

export const getUserHandler = handle.jwtAuthorizedApiRequest<JWTClaims>(
  (event, context) => {
    return json({ issuerId: event.requestContext.jwt.claims.iss });
  },
);

export const config: LambdaConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
