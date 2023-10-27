import { api } from "@notation/aws/api-gateway";
import { getTodos, getTodoCount } from "./todos/todos.fn";

const todoApi = api({ name: "todo-api" });

todoApi.get("/todos", getTodos);
todoApi.get("/todos/count", getTodoCount);
todoApi.get("/todos/count2", getTodoCount);
