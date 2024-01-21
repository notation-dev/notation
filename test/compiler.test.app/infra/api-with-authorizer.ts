import { api, jwtAuthorizerConfig, router } from "@notation/aws/api-gateway";
import { getTodos, getTodoCount } from "runtime/todo/todos.fn";

const todoApi = api({ name: "todo-api-with-authorizer" });
const todoRouter = router(todoApi);

if (!process.env.ISSUER || !process.env.AUDIENCE) {
    throw new Error("ISSUER and AUDIENCE environment variables must be set for api-with-authorizer test app")
}

const authConfig = jwtAuthorizerConfig(
    "authorizerTest",
    process.env.ISSUER,
    [process.env.AUDIENCE]
)

todoRouter.get("/todos", getTodos, jwtAuthorizerConfig(
    "authorizerTestTodos",
    process.env.ISSUER,
    [process.env.AUDIENCE]
));
todoRouter.get("/todos/count", getTodoCount, 
jwtAuthorizerConfig(
    "authorizerTestTodosCount",
    process.env.ISSUER,
    [process.env.AUDIENCE]
));
