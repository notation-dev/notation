import { resource } from "@notation/core";
import { AwsSchema } from "src/utils/types";
import * as sdk from "@aws-sdk/client-eventbridge";
import z from 'zod'

export type EventBridgeRuleSchema = AwsSchema<{
    Key: sdk.DescribeRuleCommandInput,
    // We omit the 'Rule' field since this is just an alias of the 'Name' field
    CreateParams: sdk.PutRuleCommandInput & Omit<sdk.PutTargetsCommandInput, "Rule">,
    UpdateParams: sdk.PutRuleCommandInput & Omit<sdk.PutTargetsCommandInput, "Rule">,
    ReadResult: Omit<sdk.DescribeRuleCommandOutput & sdk.ListTargetsByRuleCommandOutput, "$metadata">
}>

const eventBridgeRule = resource<EventBridgeRuleSchema>({
    type: "aws/eventBridge/rule"
})

const targetSchema = z.object({
    Id: z.string(),
    Arn: z.string(),
})

const eventBridgeRuleSchema = eventBridgeRule.defineSchema({
    Name: {
        valueType: z.string(),
        presence: "required",
        primaryKey: true,
        propertyType: "param"
    },
    EventBusName: {
        valueType: z.string(),
        presence: "optional",
        propertyType: "param",
        secondaryKey: true
    },
    ScheduleExpression: {
        valueType: z.string().optional(),
        presence: "optional",
        propertyType: "param"
    },
    Targets: {
        presence: "required",
        propertyType: "param",
        valueType: z.array(targetSchema)
    }
})

