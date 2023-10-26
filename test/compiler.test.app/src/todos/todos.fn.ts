import { FnConfig } from "@notation/aws/lambda";
import { handler, json } from "@notation/aws/api-gateway";
import { api } from "./utils";

const todos = await api.get<any[]>("/todos");

export const getTodos = handler((event) => {
  return json(todos);
});

export const getTodoCount = handler(() => {
  return json(todos.length);
});

export const config: FnConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
