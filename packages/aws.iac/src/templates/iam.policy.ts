export const lambdaTrustPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "AllowAssumeRole",
      Effect: "Allow",
      Principal: {
        Service: "lambda.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
};
