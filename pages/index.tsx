import React from "react";
import Head from "next/head";
import { Config } from "../config";
import {
    Box,
    Container,
    CssBaseline,
    Link,
    Paper,
    Theme,
    Typography,
} from "@mui/material";
import api from "../middleware/API";
import { createStyles, makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { Monitor, MonitorElement } from "../types/Monitor";
import StatusCard from "../components/StatusCard";
import Footer from "../components/Footer";
import { GetServerSideProps } from "next";
import _Global from "../global";
import { getDateRange } from "../libs/DateRange";
import AllOperationalPart from "../components/AllOperationalPart";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import StatusBar from "../components/Footer/StatusBar";

const Debug: boolean = _Global().Debug;
dayjs.extend(utc);
dayjs.extend(timezone);

// noinspection JSUnusedGlobalSymbols
/**
 * @description 从API获取数据
 * @see https://www.nextjs.cn/docs/basic-features/data-fetching
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
    const dateRange = getDateRange();

    dayjs.locale(context.locale);

    let data: Monitor = null;
    const ApiKeys = Config.apikey.split(_Global().ApiKeySplit);
    if (Debug) {
        console.log("[SSR]: Split API Keys success");
        console.log(ApiKeys);
    }
    for (let i = 0; i < ApiKeys.length; i++) {
        if (Debug) {
            console.log("[SSR]: Processing API Key " + ApiKeys[i]);
        }
        const res = await api.post("/getMonitors", {
            api_key: ApiKeys[i],
            format: "json",
            logs: 1,
            log_types: "1-2",
            logs_start_date: dateRange.logs_start_date,
            logs_end_date: dateRange.logs_end_date,
            custom_uptime_ranges: dateRange.custom_uptime_ranges,
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
            time: dayjs()
                .tz(context.locale)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString(),
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

    let MonitorAvailable = 0;

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
                    <Link
                        href={"/"}
                        target={"_self"}
                        color={"inherit"}
                        underline={"none"}
                    >
                        <Typography
                            variant={"h2"}
                            component={"h1"}
                            color={"#FFF"}
                            fontWeight={"bold"}
                        >
                            {Config.siteName}
                        </Typography>
                    </Link>
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
                <AllOperationalPart isOperational={isAllOperational} />
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
                            (
                                monitor: MonitorElement,
                                index: number,
                                monitors: MonitorElement[]
                            ) => {
                                if (monitor.status !== 0) {
                                    // TODO: Calculation of available monitors is in a loop, so rendering may slow down
                                    if (monitor.status === 2) {
                                        MonitorAvailable += 1;
                                    }
                                    return (
                                        <StatusCard
                                            monitor={monitor}
                                            key={index}
                                            index={index}
                                            total={monitors.length}
                                        />
                                    );
                                }
                            }
                        )}
                    </Paper>
                </Box>
                <Footer />
            </Container>
            <StatusBar
                total={data.pagination.total}
                available={MonitorAvailable}
            />
        </>
    );
}
