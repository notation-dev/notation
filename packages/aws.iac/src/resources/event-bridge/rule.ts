import { resource } from "@notation/core";
import { AwsSchema } from "src/utils/types";
import * as sdk from "@aws-sdk/client-eventbridge";
import z from 'zod'
import { eventBridgeClient } from "src/utils/aws-clients";
import { LambdaFunctionInstance } from "../lambda";

export type EventBridgeRuleSchema = AwsSchema<{
    Key: sdk.DescribeRuleCommandInput,
    // We omit the 'Rule' field since this is just an alias of the 'Name' field
    CreateParams: sdk.PutRuleCommandInput & Omit<sdk.PutTargetsCommandInput, "Rule">,
    UpdateParams: sdk.PutRuleCommandInput & Omit<sdk.PutTargetsCommandInput, "Rule">,
    ReadResult: Omit<sdk.DescribeRuleCommandOutput & sdk.ListTargetsByRuleCommandOutput, "$metadata">
}>

export type EventBridgeRuleDependencies = {
    lambda: LambdaFunctionInstance
}

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
    EventPattern: {
        valueType: z.string().optional(),
        presence: "optional",
        propertyType: "param"
    },
    Targets: {
        presence: "required",
        propertyType: "param",
        valueType: z.array(targetSchema)
    },
    Arn: {
        presence: "required",
        propertyType: "computed",
        valueType: z.string()
    }
})

export const EventBridgeRule = eventBridgeRuleSchema.defineOperations({

    read: async (key) => {
        const describeRuleCommand = new sdk.DescribeRuleCommand(key);
        const listRuleTargetsCommand = new sdk.ListTargetsByRuleCommand({
            // Rule is an alias for 'Name' used in the Create command
            Rule: key.Name,
            EventBusName: key.EventBusName
        });

        const [ruleDescriptionResult,listRuleTargetsResult ] = await Promise.all(
            [
                eventBridgeClient.send(describeRuleCommand),
                eventBridgeClient.send(listRuleTargetsCommand)
            ]
        );

        return {
            ...ruleDescriptionResult,
            ...listRuleTargetsResult
        }
    },

    create: async(params) => {
        const createRuleCommand = new sdk.PutRuleCommand(params)
        const createTargetsCommand = new sdk.PutTargetsCommand({
            Rule: params.Name,
            EventBusName: params.EventBusName,
            Targets: params.Targets
        })

        await eventBridgeClient.send(createRuleCommand)
        await eventBridgeClient.send(createTargetsCommand)
    },
    update: async(key, patch, params) => {
        const { Targets, ...ruleConfig } = patch

        const updateRuleCommand = new sdk.PutRuleCommand(ruleConfig)
        const updateTargetsCommand = new sdk.PutTargetsCommand({
            Rule: ruleConfig.Name,
            EventBusName: ruleConfig.EventBusName,
            Targets: Targets
        })

        await eventBridgeClient.send(updateRuleCommand)
        await eventBridgeClient.send(updateTargetsCommand)
    },
    delete: async(key) => {
        const deleteRuleCommand = new sdk.DeleteRuleCommand(key)
        await eventBridgeClient.send(deleteRuleCommand)
    }
})
.requireDependencies<EventBridgeRuleDependencies>()
.setIntrinsicConfig(async ({ deps }) => ({
    Targets: [{
        Id: deps.lambda.output.FunctionName,
        Arn: deps.lambda.output.FunctionArn
    }]
}))

export type EventBridgeRuleInstance = InstanceType<typeof EventBridgeRule>;