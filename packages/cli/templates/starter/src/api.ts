import { api, router } from "@notation/aws/api-gateway";
import { getTodos, getTodoCount } from "./todos/todos.fn";

const todoApi = api({ name: "todo-api" });
const todoRouter = router(todoApi);

todoRouter.get("/todos", getTodos);
todoRouter.get("/todos/count", getTodoCount);
