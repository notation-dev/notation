import { LambdaConfig } from "@notation/aws/lambda.fn";
import { EventBridgeScheduleHandler } from "@notation/aws/shared";


export const exampleHandler: EventBridgeScheduleHandler = 
    (event, context) => console.log(JSON.stringify(event))

export const config: LambdaConfig = {
    service: "aws/lambda",
    timeout: 5,
    memory: 64
    };