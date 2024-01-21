import * as eventBridge from "@notation/aws/event-bridge";
import { logEvent } from "runtime/log-event.fn";

eventBridge.schedule({
  name: "log-every-minute",
  schedule: eventBridge.rate(1, "minute"),
  handler: logEvent,
});
