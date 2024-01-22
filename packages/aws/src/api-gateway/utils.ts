import { decomposeUnverifiedJwt } from "aws-jwt-verify/jwt";
import { AuthorizerConfig, JWTAuthorizerConfig } from "./auth";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import type {
  ApiGatewayHandler,
  JWTAuthorizedApiGatewayHandler,
} from "src/shared";

export const mapAuthConfig = (config: JWTAuthorizerConfig) => {
  const jwtType: "JWT" = "JWT";

  return {
    Name: config.name,
    AuthorizerType: jwtType,
    IdentitySource: [config.tokenSourceExpression],
    JwtConfiguration: {
      Audience: config.audience,
      Issuer: config.issuer,
    },
  };
};

export const mapAuthType = (config: AuthorizerConfig) => {
  return config?.type === "jwt" ? "JWT" : "NONE";
};

export const toApiGatewayHandler = (
  handler: JWTAuthorizedApiGatewayHandler,
): ApiGatewayHandler => {
  const apiGatewayHandler: ApiGatewayHandler = (event: APIGatewayProxyEventV2, context: Context) => {
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

  return apiGatewayHandler
};
