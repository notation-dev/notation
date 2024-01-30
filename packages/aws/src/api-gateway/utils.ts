import { AuthorizerConfig, JWTAuthorizerConfig } from "./auth";

export const mapAuthConfig = (
  apiId: string,
  method: string,
  path: string,
  config: JWTAuthorizerConfig,
) => {
  const jwtType: "JWT" = "JWT";

  return {
    Name: `${apiId}_${method}_${path.replace("/", "")}_authorizer`,
    AuthorizerType: jwtType,
    IdentitySource: ["$request.header.Authorization"],
    JwtConfiguration: {
      Audience: config.audience,
      Issuer: config.issuer,
    },
  };
};

export const mapAuthType = (config: AuthorizerConfig) => {
  return config?.type === "jwt" ? "JWT" : "NONE";
};
