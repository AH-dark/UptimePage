import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateRange: () => {
    logs_end_date: number;
    logs_start_date: number;
    custom_uptime_ranges: string;
} = () => {
    const dates = [];
    const days = 89;
    const today = dayjs(new Date().setHours(0, 0, 0, 0)).add(1, "day");
    for (let d = 0; d < days; d++) {
        dates.push(today.subtract(d+1, "day"));
    }

    const ranges = [];
    dates.forEach((date) => {
        ranges.push(`${date.unix()}_${date.add(1, "day").unix()}`);
    });

    const logs_start_date = dates[dates.length - 1].unix();
    const logs_end_date = dates[0].add(1, "day").unix();
    ranges.push(`${logs_start_date}_${logs_end_date}`);
    const custom_uptime_ranges = ranges.join("-");

    return {
        logs_start_date: logs_start_date,
        logs_end_date: logs_end_date,
        custom_uptime_ranges: custom_uptime_ranges,
    };
};
