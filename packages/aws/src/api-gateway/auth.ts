export type JWTAuthorizerConfig = {
  type: "jwt";
  name: string;
  tokenSourceExpression: string;
  issuer: string;
  audience: string[];
};

export type AuthorizerConfig = JWTAuthorizerConfig | undefined;

export const jwtAuthorizerConfig = (
  name: string,
  issuer: string,
  audience: string[],
  authorizationHeaderField = "Authorization",
) =>
  ({
    type: "jwt",
    name: name,
    tokenSourceExpression: `$request.header.${authorizationHeaderField}`,
    issuer: issuer,
    audience: audience,
  }) as const;

export const jwtWebsocketAuthorizerConfig = (
  name: string,
  authorizationQueryParamField = "Authorization",
  issuer: string,
  audience: string[],
) => ({
  type: "jwt" as "jwt",
  name: name,
  tokenSourceExpression: `$request.querystring.${authorizationQueryParamField}`,
  issuer: issuer,
  audience: audience,
});
