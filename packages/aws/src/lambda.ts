import { AwsResourceGroup } from "./core";
import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda";

export type FnConfig = {
  service: "aws/lambda";
  memory?: number;
  timeout?: number;
};

export type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => APIGatewayProxyResultV2 | Promise<APIGatewayProxyResultV2>;

export const handle = {
  apiRequest: (handler: ApiGatewayHandler): ApiGatewayHandler => handler,
};

export const fn = (config: { handler: string }) => {
  const functionGroup = new AwsResourceGroup({ type: "function", config });

  const role = functionGroup.createResource({
    type: "iam/role",
  });

  const policyAttachment = functionGroup.createResource({
    type: "iam/policy-attachment",
    dependencies: {
      roleId: role.id,
    },
  });

  functionGroup.createResource({
    type: "lambda",
    dependencies: {
      policyId: policyAttachment.id,
    },
  });

  return functionGroup;
};
