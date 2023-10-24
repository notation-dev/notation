import { FnConfig } from "@notation/aws/lambda";
import { handler, json } from "@notation/aws/api-gateway";

const todosRes = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const todos = (await todosRes.json()) as any[];

export const getTodos = handler((event) => {
  console.log(event);
  return json(todos);
});

export const getTodoCount = handler(() => {
  return json(todos.length);
});

export const config: FnConfig = {
  timeout: 5,
  memory: 64,
};
