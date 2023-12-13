export type RateUnit = "minutes" | "hours" | "days"

export type RateSchedule = {
    type: "rate",
    rate: number,
    unit: RateUnit
}

export type CronSchedule = {
    type: "cron",
    cronExpression: string
}

export type OneTimeSchedule = {
    type: "once",
    dateTime: Date
}

export type Schedule = RateSchedule | CronSchedule | OneTimeSchedule

export const rateSchedule = (rate: number, unit: RateUnit) : Schedule => {
    return {
        type: "rate",
        rate: rate,
        unit: unit
    }
}

export const cronSchedule = (cronExpression: string): Schedule => {
    return {
        type: "cron",
        cronExpression: cronExpression
    }
}

export const oneTimeSchedule = (dateTime: Date): Schedule => {
    return {
        type: "once",
        dateTime: dateTime
    }
}

export const toAwsScheduleExpression = (schedule: Schedule): string => {
    throw new Error("wip")
}