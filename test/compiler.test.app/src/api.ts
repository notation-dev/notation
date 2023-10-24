import { apiRoute } from "@notation/aws";
import { getTodos, getTodoCount } from "./todos/todos.fn";

export const todoRoute = apiRoute({
  path: "/todos",
  handler: getTodos,
});

export const todoCountRoute = apiRoute({
  path: "/todos/count",
  handler: getTodoCount,
});
