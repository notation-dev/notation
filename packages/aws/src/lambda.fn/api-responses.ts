export const json = (result: any) => ({
  body: JSON.stringify(result),
  statusCode: 200,
});
