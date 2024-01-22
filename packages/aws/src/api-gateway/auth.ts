export type JWTAuthorizerConfig = {
  type: "jwt";
  name: string;
  tokenSourceExpression: string;
  issuer: string;
  audience: string[];
  scopes: string[];
};

export type Unauthenticated = {
  type: "NONE";
  scopes: string[];
};

export type AuthorizerConfig = JWTAuthorizerConfig | Unauthenticated;

export const jwtAuthorizerConfig = (
  name: string,
  issuer: string,
  audience: string[],
  scopes = [],
) =>
  ({
    type: "jwt",
    name: name,
    tokenSourceExpression: `$request.header.Authorization`,
    issuer: issuer,
    scopes: scopes,
    audience: audience,
  }) as const;

export const jwtWebsocketAuthorizerConfig = (
  name: string,
  authorizationQueryParamField = "Authorization",
  issuer: string,
  scopes: [],
  audience: string[],
) => ({
  type: "jwt" as "jwt",
  name: name,
  tokenSourceExpression: `$request.querystring.${authorizationQueryParamField}`,
  issuer: issuer,
  scopes: scopes,
  audience: audience,
});

export const NO_AUTH = {
  type: "NONE",
  scopes: [] as string[],
} as const;
