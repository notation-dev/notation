import { ApiGatewayV2Client } from "@aws-sdk/client-apigatewayv2";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { IAMClient } from "@aws-sdk/client-iam";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { STSClient } from "@aws-sdk/client-sts";
import { region } from "src/config";

export const apiGatewayClient = new ApiGatewayV2Client({ region });
export const cloudFrontClient = new CloudFrontClient({ region });
export const cloudWatchLogsClient = new CloudWatchLogsClient({ region });
export const eventBridgeClient = new EventBridgeClient({ region });
export const iamClient = new IAMClient({ region });
export const lambdaClient = new LambdaClient({ region });
export const stsClient = new STSClient({ region });
