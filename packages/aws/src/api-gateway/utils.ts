import { AuthorizerConfig, JWTAuthorizerConfig } from "./auth"

export const mapAuthConfig = (config: JWTAuthorizerConfig) => {
  const jwtType: "JWT" = "JWT"

  return {
    Name: config.name,
    AuthorizerType: jwtType,
    IdentitySource: [config.tokenSourceExpression],
    JwtConfiguration: {
      Audience: config.audience,
      Issuer: config.issuer
    }
  }

}