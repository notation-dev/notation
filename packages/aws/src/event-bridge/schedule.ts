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

export const rateSchedule = (rate: number, unit: RateSchedule) : Schedule => {
    throw new Error("wip")
}

export const cronSchedule = (cronExpression: string): Schedule => {
    throw new Error("wip")
}

export const oneTimeSchedule = (date: Date): Schedule => {
    throw new Error("wip")
}

