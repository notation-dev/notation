import { lambda } from "@notation/aws/lambda";

export const externalJsLambda = lambda({
  id: "external-js",
  handler: "handler",
  code: {
    type: "file",
    path: "external/lambda.mjs",
  },
});

export const externalZipLambda = lambda({
  id: "external-zip",
  handler: "handler",
  code: {
    type: "zip",
    path: "external/lambda.zip",
  },
});
