import { eventBus, eventBridgeSchedule, rateSchedule } from "@notation/aws/event-bridge"
import { exampleHandler } from "./eventbridge/scheduleEvent.fn"

eventBus({name: "stuff"})

eventBridgeSchedule(
    rateSchedule(1, "minute"),
    "Event bridge schedule test",
    exampleHandler
)