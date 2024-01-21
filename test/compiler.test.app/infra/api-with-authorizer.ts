import { api, jwtAuthorizerConfig, router } from "@notation/aws/api-gateway";
import { getTodos, getTodoCount } from "runtime/todo/todos.fn";

const todoApi = api({ name: "todo-api-with-authorizer" });
const todoRouter = router(todoApi);

if (!process.env.ISSUER || !process.env.AUDIENCE) {
  throw new Error(
    "ISSUER and AUDIENCE environment variables must be set for api-with-authorizer test app",
  );
}

const todosAuthConfig = jwtAuthorizerConfig(
  "authorizerTestTodos2",
  process.env.ISSUER,
  [process.env.AUDIENCE],
);

const todosCountAuthConfig = jwtAuthorizerConfig(
  "authorizerTestTodosCount2",
  process.env.ISSUER,
  [process.env.AUDIENCE],
);

todoRouter.get("/todos-auth", getTodos, todosAuthConfig);
todoRouter.get("/todos-auth/count", getTodoCount, todosCountAuthConfig);
