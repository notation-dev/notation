import { region, accountId } from "src/context";

export const getLambdaInvocationUri = (arn: string) => {
  return `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${arn}/invocations`;
};

export const generateApiGatewaySourceArn = (apiId: string) => {
  return `arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*`;
};
