import { api } from "@notation/aws/api-gateway";
import { getTodos, getTodoCount } from "./todos/todos.fn";

api.get("/todos", getTodos);
api.get("/todos/count", getTodoCount);
api.get("/todos/count2", getTodoCount);
