import { eventBus, eventBridgeSchedule, rateSchedule } from "@notation/aws/event-bridge"
import { exampleHandler2 } from "runtime/eventbridge/scheduleEvent.fn"

eventBus({name: "stuff"})

eventBridgeSchedule(
    rateSchedule(1, "minute"),
    "Event-bridge-schedule-test",
    exampleHandler2
)