import { ResourceGroup } from "@notation/core";
import { EventBridgeHandler } from "src/shared/lambda.handler";
import { Schedule, toAwsScheduleExpression } from "./schedule";
import { lambda } from "src/lambda";
import * as aws from "@notation/aws.iac";

export const eventBridgeSchedule = (
    schedule: Schedule,
    ruleName: string,
    handler: EventBridgeHandler<"Scheduled Event", any>
): ResourceGroup => {

    const eventBridgeScheduleGroup = new aws.AwsResourceGroup("aws/eventBridge/schedule", {
        config: {
            ruleName
        }
    })

    // at compile time becomes infra module
    const lambdaGroup = handler as any as ReturnType<typeof lambda>;
    const lambdaResource = lambdaGroup.findResource(aws.lambda.LambdaFunction)!;

    const eventBridgeRule = new aws.eventBridge.EventBridgeRule({
        id: `${ruleName}-eventbridge-rule`,
        config: {
            Name: ruleName,
            ScheduleExpression: toAwsScheduleExpression(schedule)
        },
        dependencies: {
            lambda: lambdaResource
        },
    })

    const permission = lambdaGroup.findResource(
        aws.eventBridge.LambdaEventBridgeRulePermission 
    );

    // TODO: is this brittle if the function name changes? Where does the function name come from?
    if (!permission) {
        lambdaGroup.add(new aws.eventBridge.LambdaEventBridgeRulePermission({
            id: `${ruleName}-eventbridge-permission`,
            dependencies: {
                lambda: lambdaResource,
                eventBridgeRule: eventBridgeRule
            }
        }))
    }

    return eventBridgeScheduleGroup
}