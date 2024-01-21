import { AuthorizerConfig } from "./auth"

export const mapAuthConfig = (apiId: string, config: AuthorizerConfig) => {
    if (config === undefined) {
      return undefined
    } else if (config.type === "jwt") {
      const jwtType: "JWT" = "JWT"
  
      return {
        ApiId: apiId,
        Name: config.name,
        AuthorizerType: jwtType,
        IdentitySource: [config.tokenSourceExpression],
        JwtConfiguration: {
          Audience: config.audience,
          Issuer: config.issuer
        }
      }
    }
}