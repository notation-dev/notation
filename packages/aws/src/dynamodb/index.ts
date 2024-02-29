import * as aws from "@notation/aws.iac";

export const table = (config: any) => {
  return new aws.AwsResourceGroup("DynamoDB", {
    name: "DynamoDBTable",
  });
};
