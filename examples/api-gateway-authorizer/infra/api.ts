import { JWTAuthorizerConfig, api, router } from "@notation/aws/api-gateway";
import { JWTClaims, getUserHandler } from "runtime/user.fn";

if (!process.env.ISSUER || !process.env.AUDIENCE) {
  throw new Error(
    "ISSUER and AUDIENCE environment variables must be set for the api-with-authorizer demo app",
  );
}

const userAuthConfig: JWTAuthorizerConfig = {
  type: "jwt",
  issuer: process.env.ISSUER,
  audience: [process.env.AUDIENCE],
  scopes: [],
};

const userApi = api({ name: "user-api-jwt" });
const userApiRouter =
  router(userApi).withJWTAuthorizer<JWTClaims>(userAuthConfig);

userApiRouter.get("/user", getUserHandler);
