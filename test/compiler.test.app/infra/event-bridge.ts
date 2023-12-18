import { eventBridgeSchedule, rateSchedule } from "@notation/aws/event-bridge";
import { exampleHandler2 } from "runtime/eventbridge/scheduleEvent.fn";

eventBridgeSchedule(
  {
    ruleName: "Event-bridge-schedule-test",
    schedule: rateSchedule(1, "minute"),
  },
  exampleHandler2,
);
