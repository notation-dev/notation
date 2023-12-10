import { api, router } from "@notation/aws/api-gateway";
import { eventBus } from "@notation/aws/event-bridge"
import { getTodos, getTodoCount } from "./todos/todos.fn";

eventBus({name: "stuff"})

const todoApi = api({ name: "todo-api" });
const todoRouter = router(todoApi);

todoRouter.get("/todos", getTodos);
todoRouter.get("/todos/count", getTodoCount);

