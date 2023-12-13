import { ResourceGroup } from "@notation/core";
import { EventBridgeHandler } from "src/shared/lambda.handler";
import { Schedule } from "./schedule";

export const eventBridgeSchedule = (
    schedule: Schedule,
    handler: EventBridgeHandler<"Scheduled Event", any>
): ResourceGroup => {

    throw new Error("wip")
}