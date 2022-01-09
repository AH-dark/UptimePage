import dayjs from "dayjs";

export default function AvailablePercent(
    custom_uptime_ranges: string,
    day: number,
    create_time: number
) {
    const uptimeRangesStr = custom_uptime_ranges.split("-");
    const diff = dayjs(new Date().setHours(0, 0, 0, 0))
        .add(1, "day")
        .diff(create_time, "day");
    let average = 0;
    const num = Math.min(day, uptimeRangesStr.length, diff);
    for (let i = 0; i < num; i++) {
        average += parseFloat(uptimeRangesStr[i]);
    }
    return (average / num).toFixed(3);
}
