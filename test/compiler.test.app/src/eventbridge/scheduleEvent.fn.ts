import { EventBridgeScheduleHandler } from "@notation/aws/shared";


export const exampleHandler: EventBridgeScheduleHandler = 
    (event, context) => console.log(JSON.stringify(event))
