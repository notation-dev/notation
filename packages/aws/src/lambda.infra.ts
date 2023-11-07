import path from "node:path";
import fs from "node:fs";
import { AwsResourceGroup } from "@notation/aws.iac/client";
import { lambda } from "@notation/aws.iac/resources";

export const fn = (config: { fileName: string; handler: string }) => {
  // @todo: make this a zip resource (maybe with a deploySync method)
  const zipPath = path.join(process.cwd(), `${config.fileName}.zip`);
  const zipContents = fs.readFileSync(zipPath);

  const functionGroup = new AwsResourceGroup("aws/function", { config });

  const role = functionGroup.add(
    new lambda.LambdaIamRole({
      config: { RoleName: `${functionGroup.id}-role` },
    }),
  );

  const policyAttachment = functionGroup.add(
    new lambda.LambdaRolePolicyAttachment({
      config: {
        // todo: move to resource, or provide default roles
        PolicyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      },
      dependencies: { role },
    }),
  );

  const lambdaResource = functionGroup.add(
    new lambda.Lambda({
      config: {
        Code: { ZipFile: zipContents },
        PackageType: "Zip",
        FunctionName: `function-${functionGroup.id}`,
        Handler: `index.${config.handler}`,
        Runtime: "nodejs18.x",
      },
      dependencies: { role, policyAttachment },
    }),
  );

  functionGroup.add(
    new lambda.LambdaLogGroup({
      dependencies: { lambda: lambdaResource },
    }),
  );

  return functionGroup;
};
