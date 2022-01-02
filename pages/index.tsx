import React from "react";
import Head                       from "next/head";
import { Config } from "../config";
import {
    Box,
    Container,
    CssBaseline,
    Paper,
    Theme,
    Typography,
}                                   from "@mui/material";
import api                          from "../middleware/API";
import { createStyles, makeStyles } from "@mui/styles";
import dayjs                        from "dayjs";
import { Monitor, MonitorElement }  from "../types/Monitor";
import CheckCircleIcon              from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon                    from "@mui/icons-material/ErrorRounded";
import StatusCard                   from "../components/StatusCard";
import Footer                       from "../components/Footer";
import { GetServerSideProps }       from "next";
import _Global                      from "../global";

const Debug:boolean = _Global().Debug;

// noinspection JSUnusedGlobalSymbols
/**
 * @description 从API获取数据
 * @see https://www.nextjs.cn/docs/basic-features/data-fetching
 */
export const getServerSideProps: GetServerSideProps = async () => {
    const dates = [];
    const days = 29;
    const today = dayjs(new Date().setHours(0, 0, 0, 0));
    for (let d = 0; d < days; d++) {
        dates.push(today.subtract(d, "day"));
    }

    const ranges = [];
    dates.forEach((date) => {
        ranges.push(`${date.unix()}_${date.add(1, "day").unix()}`);
    });

    const logs_start_date = dates[dates.length - 1].unix();
    const logs_end_date = dates[0].add(1, "day").unix();
    ranges.push(`${logs_start_date}_${logs_end_date}`);

    let data: Monitor = null;
    const ApiKeys = Config.apikey.split(_Global().ApiKeySplit);
    if (Debug) {
        console.log("[SSR]: Split API Keys success");
        console.log(ApiKeys);
    }
    for(let i=0;i<ApiKeys.length;i++) {
        if (Debug) {
            console.log("[SSR]: Processing API Key " + ApiKeys[i]);
        }
        const res = await api.post("/getMonitors", {
            api_key: ApiKeys[i],
            format: "json",
            logs: 1,
            log_types: "1-2",
            logs_start_date: logs_start_date,
            logs_end_date: logs_end_date,
            custom_uptime_ranges: ranges.join("-"),
        });
        if (data == null) {
            data = res.data;
        } else {
            data.stat =
                data.stat !== "ok" || res.data.stat !== "ok" ? "fail" : "ok";
            data.pagination.offset += res.data.pagination.offset;
            data.pagination.limit += res.data.pagination.limit;
            data.pagination.total += res.data.pagination.total;
            res.data.monitors.map((value: MonitorElement) => {
                data.monitors.push(value);
            });
        }
    }

    if (Debug) {
        console.log(data);
    }
    return {
        props: {
            data: data,
            time: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
        },
    };
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            padding: "45px 0 80px 0",
            background: "#000000",
            color: "#000000",
        },
        headerContainer: {
            paddingLeft: 45,
            paddingRight: 45,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        pspHeadSec: {
            marginTop: -40,
            marginBottom: theme.spacing(4),
            padding: "2.6rem",
            boxShadow: "0 20px 60px rgb(0 0 0 / 10%)",
            color: "#131a26",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
        },
        statIconOperational: {
            color: "#3bd671",
            marginRight: theme.spacing(3),
            fontSize: 70,
        },
        statIconUnavailable: {
            color: "#d30e0e",
            marginRight: theme.spacing(3),
            fontSize: 70,
        },
        paper: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            padding: "2rem",
            boxShadow: "0 20px 60px rgb(0 0 0 / 10%)",
            marginTop: theme.spacing(1.5),
            paddingBottom: 0,
        },
    })
);

// noinspection JSUnusedGlobalSymbols
export default function Home({
    data,
    time,
}: {
    data: Monitor;
    time: string;
}): JSX.Element {
    const classes = useStyles();

    if (Debug) {
        console.log("[Home]: Main function gets the data value.");
        console.log(data);
    }
    const monitors: MonitorElement[] = data.monitors;
    const isAllOperational: boolean =
        data.pagination.offset === 0 || data.pagination.total === 0;

    return (
        <>
            <Head>
                <title>{Config.siteName}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=5"
                />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="robots" content="noindex, nofollow" />
                <meta property="og:site_name" content={Config.siteName} />
                <meta property="og:title" content={Config.siteName} />
                <meta property="og:locale" content="en_US" />
                <meta
                    property="og:description"
                    content="服务状态监控页面，使用UptimeRobot API获取数据。"
                />
                <link rel="mask-icon" href={Config.logo} color="#3f51b5" />
                <link rel="shortcut icon" href={Config.logo} />
                <link rel="icon" href={Config.logo} />
            </Head>
            <CssBaseline />
            <header className={classes.header}>
                <Container maxWidth={"lg"} className={classes.headerContainer}>
                    <Typography
                        variant={"h2"}
                        component={"h1"}
                        color={"#FFF"}
                        fontWeight={"bold"}
                    >
                        {Config.siteName}
                    </Typography>
                    <Typography
                        variant={"body1"}
                        component={"span"}
                        display={"block"}
                        color={"#b7b7b7"}
                    >
                        {time}
                    </Typography>
                </Container>
            </header>
            <Container maxWidth={"md"}>
                <Paper className={classes.pspHeadSec}>
                    {isAllOperational ? (
                        <>
                            <CheckCircleIcon
                                className={classes.statIconOperational}
                            />
                            <Typography
                                variant={"h4"}
                                component={"h2"}
                                fontWeight={"bold"}
                            >
                                All systems{" "}
                                <span
                                    style={{
                                        color: "#3bd671",
                                    }}
                                >
                                    operational
                                </span>
                            </Typography>
                        </>
                    ) : (
                        <>
                            <ErrorIcon
                                className={classes.statIconUnavailable}
                            />
                            <Typography
                                variant={"h4"}
                                component={"h2"}
                                fontWeight={"bold"}
                            >
                                Some systems{" "}
                                <span
                                    style={{
                                        color: "#d30e0e",
                                    }}
                                >
                                    unavailable
                                </span>
                            </Typography>
                        </>
                    )}
                </Paper>
                <Box component={"section"} pb={6}>
                    <Typography
                        variant={"h4"}
                        component={"h2"}
                        fontWeight={"bold"}
                    >
                        {"Uptime"}
                    </Typography>
                    <Paper className={classes.paper}>
                        {monitors.map(
                            (monitor: MonitorElement, index: number) => {
                                if (monitor.status !== 0) {
                                    return (
                                        <StatusCard
                                            monitor={monitor}
                                            key={index}
                                        />
                                    );
                                }
                            }
                        )}
                    </Paper>
                </Box>
                <Footer />
            </Container>
        </>
    );
}
