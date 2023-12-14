export type RateUnit = "minute" | "minutes"| "hour" | "hours" | "day" | "days"

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
    if (schedule.type === "rate") {
        return `rate(${schedule.rate} ${schedule.unit})`
    } else if (schedule.type === "cron") {
        return `cron(${schedule.cronExpression})`
    } else {
        const dateTime = schedule.dateTime
        const humanBasedMonth = dateTime.getMonth() + 1
        const monthString = humanBasedMonth >= 10 ? `${humanBasedMonth}`: `0${humanBasedMonth}`
        const dayString = dateTime.getDate() >= 10 ? `${dateTime.getDate()}` : `0${dateTime.getDate()}`

        return `at(${dateTime.getFullYear()}-${monthString})-${dayString}-${dateTime.toLocaleTimeString()}`
    }
}