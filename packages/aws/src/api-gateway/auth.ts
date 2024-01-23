export type JWTAuthorizerConfig = {
  type: "jwt";
  name: string;
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
    issuer: issuer,
    scopes: scopes,
    audience: audience,
  }) as const;

export const NO_AUTH = {
  type: "NONE",
  scopes: [] as string[],
} as const;
