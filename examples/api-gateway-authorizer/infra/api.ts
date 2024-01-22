import {
  api,
  jwtAuthorizerConfig,
  jwtAuthenticatedUserRouter,
} from "@notation/aws/api-gateway";
import { getUserHandler } from "runtime/user.fn";

if (!process.env.ISSUER || !process.env.AUDIENCE) {
  throw new Error(
    "ISSUER and AUDIENCE environment variables must be set for the api-with-authorizer demo app",
  );
}

const userAuthConfig = jwtAuthorizerConfig(
  "authorizerTestTodos2",
  process.env.ISSUER,
  [process.env.AUDIENCE],
);

const userApi = api({ name: "user-api" });
const userApiRouter = jwtAuthenticatedUserRouter(userApi, userAuthConfig);

userApiRouter.get("/user", getUserHandler);
