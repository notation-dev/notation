export type JWTAuthorizerConfig = {
  type: "jwt";
  issuer: string;
  audience: string[];
  scopes: string[];
};

export type Unauthenticated = {
  type: "NONE";
  scopes: string[];
};

export type AuthorizerConfig = JWTAuthorizerConfig | Unauthenticated;

export const NO_AUTH = {
  type: "NONE",
  scopes: [] as string[],
} as const;
