import * as eventBridge from "@notation/aws/event-bridge";
import { exampleHandler2 } from "runtime/eventbridge/scheduleEvent.fn";

eventBridge.schedule({
  name: "Event-bridge-schedule-test",
  schedule: eventBridge.rate(1, "minute"),
  handler: exampleHandler2,
});
