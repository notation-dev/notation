import * as aws from "@notation/aws.iac";
import * as std from "@notation/std.iac";

export const lambda = (config: { fileName: string; handler: string }) => {
  const functionGroup = new aws.AwsResourceGroup("aws/function", { config });

  const zipFile = functionGroup.add(
    new std.fs.Zip({
      config: { filePath: config.fileName },
    }),
  );

  const role = functionGroup.add(
    new aws.lambda.LambdaIamRole({
      config: { RoleName: `${functionGroup.id}-role` },
    }),
  );

  const policyAttachment = functionGroup.add(
    new aws.lambda.LambdaRolePolicyAttachment({
      config: {
        // todo: move to resource, or provide default roles
        PolicyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      },
      dependencies: { role },
    }),
  );

  const lambdaResource = functionGroup.add(
    new aws.lambda.Lambda({
      config: {
        FunctionName: `function-${functionGroup.id}`,
        Handler: `index.${config.handler}`,
        Runtime: "nodejs18.x",
      },
      dependencies: {
        role,
        policyAttachment,
        zipFile,
      },
    }),
  );

  functionGroup.add(
    new aws.lambda.LambdaLogGroup({
      dependencies: { lambda: lambdaResource },
    }),
  );

  return functionGroup;
};
