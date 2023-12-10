import * as aws from '@notation/aws.iac'
import { BaseResource } from '@notation/core'

export const eventBus = (config: {name: string, eventSourceName?: string}): BaseResource => {
    const eventBusId = `${config.name}-event-bus`

    return new aws.eventBridge.Bus({
        id: eventBusId,
        config: {
            Name: config.name,
        }
    })
}