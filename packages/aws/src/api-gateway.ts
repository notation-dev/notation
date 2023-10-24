import { handle } from "./lambda";

export const apiRoute = (...args: any) => {};

export const handler = handle.apiGateway;

export const json = (result: any) => ({
  body: JSON.stringify(result),
  statusCode: 200,
});
