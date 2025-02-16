import { lambda } from "@notation/aws/lambda";

lambda({
  id: "external-js",
  handler: "handler",
  code: {
    type: "file",
    path: "external/lambda.js",
  },
});

lambda({
  id: "external-zip",
  handler: "handler",
  code: {
    type: "zip",
    path: "external/lambda.zip",
  },
});
