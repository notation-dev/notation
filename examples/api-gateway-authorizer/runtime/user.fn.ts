import type { LambdaConfig } from "@notation/aws/lambda.fn";
import { handle, json } from "@notation/aws/lambda.fn";

export const getUserHandler = handle.apiRequest(() => {
  return json({ userId: "" });
});

export const config: LambdaConfig = {
  service: "aws/lambda",
  timeout: 5,
  memory: 64,
};
