import * as aws from "@notation/aws.iac";

export const api = (rgConfig: { name: string }) => {
  const apiGroup = new aws.AwsResourceGroup("api", rgConfig);

  const apiResource = apiGroup.add(
    new aws.apiGateway.Api({
      config: {
        Name: rgConfig.name,
        ProtocolType: "HTTP",
      },
    }),
  );

  apiGroup.add(
    new aws.apiGateway.Stage({
      config: { StageName: "$default", AutoDeploy: true },
      dependencies: { api: apiResource },
    }),
  );

  return apiGroup;
};
