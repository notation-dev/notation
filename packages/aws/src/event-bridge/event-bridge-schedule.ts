import { ResourceGroup } from "@notation/core";
import { EventBridgeHandler } from "src/shared/lambda.handler";
import { Schedule, toAwsScheduleExpression } from "./schedule";
import { lambda } from "src/lambda";
import * as aws from "@notation/aws.iac";

export const eventBridgeSchedule = (
  config: { ruleName: string; schedule: Schedule },
  handler: EventBridgeHandler<"Scheduled Event", any>,
): ResourceGroup => {
  const eventBridgeScheduleGroup = new aws.AwsResourceGroup(
    "aws/eventBridge/schedule",
    config,
  );

  // at compile time becomes infra module
  const lambdaGroup = handler as any as ReturnType<typeof lambda>;
  const lambdaResource = lambdaGroup.findResource(aws.lambda.LambdaFunction)!;

  const eventBridgeRule = new aws.eventBridge.EventBridgeRule({
    id: `${config.ruleName}-eventbridge-rule`,
    config: {
      Name: config.ruleName,
      ScheduleExpression: toAwsScheduleExpression(config.schedule),
      EventBusName: "default"
    },
    dependencies: {
      lambda: lambdaResource,
    },
  });

  eventBridgeScheduleGroup.add(eventBridgeRule);

  const permission = lambdaGroup.findResource(
    aws.eventBridge.LambdaEventBridgeRulePermission,
  );

  if (!permission) {
    lambdaGroup.add(
      new aws.eventBridge.LambdaEventBridgeRulePermission({
        id: `${config.ruleName}-eventbridge-permission`,
        dependencies: {
          lambda: lambdaResource,
          eventBridgeRule: eventBridgeRule,
        },
      }),
    );
  }

  return eventBridgeScheduleGroup;
};
