import { Schedule } from "./schedule";

export const toAwsScheduleExpression = (schedule: Schedule): string => {
  if (schedule.type === "rate") {
    return `rate(${schedule.rate} ${schedule.unit})`;
  } else if (schedule.type === "cron") {
    return `cron(${schedule.cronExpression})`;
  } else {
    const dateTime = schedule.dateTime;
    const humanBasedMonth = dateTime.getMonth() + 1;
    const monthString =
      humanBasedMonth >= 10 ? `${humanBasedMonth}` : `0${humanBasedMonth}`;
    const dayString =
      dateTime.getDate() >= 10
        ? `${dateTime.getDate()}`
        : `0${dateTime.getDate()}`;

    return `at(${dateTime.getFullYear()}-${monthString})-${dayString}-${dateTime.toLocaleTimeString()}`;
  }
};
