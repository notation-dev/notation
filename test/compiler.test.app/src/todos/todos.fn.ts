import { FnConfig, handle } from "@notation/aws/lambda";
import { json } from "@notation/aws/api-gateway";
import { api } from "./utils";

const todos = await api.get<any[]>("/todos");

export const getTodos = handle.apiRequest(() => {
  return json(todos);
});

export const getTodoCount = handle.apiRequest(() => {
  return json(todos.length);
});

export const config: FnConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
