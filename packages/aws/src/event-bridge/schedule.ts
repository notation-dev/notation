export type RateUnit = "minute" | "minutes" | "hour" | "hours" | "day" | "days";

export type RateSchedule = {
  type: "rate";
  rate: number;
  unit: RateUnit;
};

export type CronSchedule = {
  type: "cron";
  cronExpression: string;
};

export type OneTimeSchedule = {
  type: "once";
  dateTime: Date;
};

export type Schedule = RateSchedule | CronSchedule | OneTimeSchedule;

export const rate = (rate: number, unit: RateUnit): Schedule => {
  return {
    type: "rate",
    rate: rate,
    unit: unit,
  };
};

export const cron = (cronExpression: string): Schedule => {
  return {
    type: "cron",
    cronExpression: cronExpression,
  };
};

export const once = (dateTime: Date): Schedule => {
  return {
    type: "once",
    dateTime: dateTime,
  };
};
