import { resource } from "@notation/core";
import * as sdk from "@aws-sdk/client-eventbridge";
import { AwsSchema } from "src/utils/types";

export type EventBridgeRuleSchema = AwsSchema<{
    Key: sdk.DescribeRuleRequest,
    CreateParams: sdk.PutRuleRequest,
    ReadResult: sdk.DescribeRuleResponse,
    UpdateParams: sdk.PutRuleRequest
}>

const eventBridgeRule = resource<EventBridgeRuleSchema>({
    type: "aws/eventBridge/rule"
})

// Work in progressaroonie