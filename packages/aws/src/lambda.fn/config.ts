export type LambdaConfig = {
  service: "aws/lambda";
  memory?: number;
  timeout?: number;
  policies?: any[];
};

export const $config = (config: LambdaConfig) => config;
