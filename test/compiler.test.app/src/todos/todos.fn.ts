import { handler, FnConfig } from "@notation/aws";

const todosRes = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const todos = (await todosRes.json()) as any[];

export const getTodos = handler(() => {
  return todos;
});

export const getTodoCount = handler(() => {
  return todos.length;
});

export const config: FnConfig = {
  timeout: 5,
  memory: 64,
};
