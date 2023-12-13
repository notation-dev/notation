import * as aws from '@notation/aws.iac'
import { ResourceGroup } from '@notation/core'

export const eventBus = (config: {name: string, eventSourceName?: string}): ResourceGroup => {
    const eventBusGroup = new aws.AwsResourceGroup("aws/event-bridge/bus", { config });

    const eventBusId = `${config.name}-event-bus`

    const bus = new aws.eventBridge.Bus({
        id: eventBusId,
        config: {
            Name: config.name,
        }
    })

    eventBusGroup.add(bus)

    return eventBusGroup
}