import React from "react";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import {
    Box,
    Container,
    CssBaseline,
    Grid,
    Link,
    Paper,
    Theme,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { Config } from "../../config";
import { Monitor, MonitorElement } from "../../types/Monitor";
import Head from "next/head";
import Footer from "../../components/Footer";
import _Global from "../../global";
import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import api from "../../middleware/API";
import { getDateRange } from "../../libs/DateRange";
import AllOperationalPart from "../../components/AllOperationalPart";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import StatusCard from "../../components/StatusCard";
import OverAllUptime from "../../components/OverAllUptime";
import StatusBar from "../../components/Footer/StatusBar";
import { AxiosResponse } from "axios";
import { AccountDetails } from "../../types/AccountDetails";

dayjs.extend(utc);
dayjs.extend(timezone);

// noinspection JSUnusedGlobalSymbols
/**
 * @description 从API获取数据
 * @see https://www.nextjs.cn/docs/basic-features/data-fetching
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.query.id.toString().split("-")[0];
    const MonitorId: number = Number(id);

    dayjs.locale(context.locale);

    const dataRange = getDateRange();

    let data: Monitor = null;
    let accountDetails: AccountDetails = null;

    const ApiKeys = Config.apikey.split(_Global().ApiKeySplit);
    if (Debug) {
        console.log("[SSR]: Split API Keys success");
        console.log(ApiKeys);
        console.log("[SSR]: Processing Monitor " + MonitorId.toString());
    }
    for (let i = 0; i < ApiKeys.length; i++) {
        if (Debug) {
            console.log("[SSR]: Processing API Key " + ApiKeys[i]);
        }
        // Get Monitors List
        const res: AxiosResponse<Monitor> = await api.post("/getMonitors", {
            api_key: ApiKeys[i],
            monitors: `${MonitorId}-${MonitorId + 1}`,
            format: "json",
            logs: 1,
            log_types: "1-2",
            logs_start_date: dataRange.logs_start_date,
            logs_end_date: dataRange.logs_end_date,
            custom_uptime_ranges: dataRange.custom_uptime_ranges,
        });
        if (res.data.stat === "ok") {
            data = res.data;
        }

        // Get Account Details
        const resAccount: AxiosResponse<AccountDetails> = await api.post(
            "/getAccountDetails",
            {
                api_key: ApiKeys[i],
                format: "json",
            }
        );
        if (resAccount.data.stat === "ok") {
            if (accountDetails === null) {
                accountDetails = resAccount.data;
            } else {
                accountDetails.account.monitor_limit +=
                    resAccount.data.account.monitor_limit;
                accountDetails.account.monitor_interval +=
                    resAccount.data.account.monitor_interval;
                accountDetails.account.up_monitors +=
                    resAccount.data.account.up_monitors;
                accountDetails.account.down_monitors +=
                    resAccount.data.account.down_monitors;
                accountDetails.account.paused_monitors +=
                    resAccount.data.account.paused_monitors;
            }
        }
    }

    if (Debug) {
        console.log(data);
    }

    return {
        props: {
            data: data,
            account: accountDetails,
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
        main: {
            "& > *": {
                paddingBottom: theme.spacing(6),
            },
        },
        paper: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            padding: "2rem",
            boxShadow: "0 20px 60px rgb(0 0 0 / 10%)",
            marginTop: theme.spacing(1.5),
        },
    })
);

const Debug: boolean = _Global().Debug;

export default function MonitorId({
    data,
    account,
    time,
}: {
    data: Monitor;
    account: AccountDetails;
    time: string;
}) {
    const router = useRouter();
    const MonitorId: number = Number(router.query.id.toString().split("-"));

    const theme = useTheme();
    const classes = useStyles(theme);

    if (Config.usePage === false) {
        return "Config.usePage is false, this page will not be enabled.";
    }

    if (Debug) {
        console.log("[Monitor]: Main function gets the data value.");
        console.log("Get monitor id: " + MonitorId.toString());
        console.log(data);
    }
    const monitor: MonitorElement = data.monitors[0]; // Due to the imperfection of the UptimeRobot API, I had to request 2 Monitors, and the former is what we need, so only the former data is obtained.
    const isAllOperational: boolean = account.account.down_monitors === 0;

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
                <AllOperationalPart
                    name={monitor.friendly_name}
                    isOperational={isAllOperational}
                    check={monitor.interval}
                />
                <Box className={classes.main}>
                    <Box component={"section"}>
                        <Typography
                            variant={"h4"}
                            component={"h2"}
                            fontWeight={"bold"}
                        >
                            {"Uptime"}
                        </Typography>
                        <Paper
                            className={classes.paper}
                            style={{ paddingBottom: 0 }}
                        >
                            <StatusCard monitor={monitor} index={0} total={1} />
                        </Paper>
                    </Box>
                    <Box>
                        <Typography
                            variant={"h4"}
                            component={"h2"}
                            fontWeight={"bold"}
                        >
                            {"Overall Uptime"}
                        </Typography>
                        <Paper className={classes.paper}>
                            <Grid container={true} spacing={2}>
                                <OverAllUptime
                                    customUptimeRanges={
                                        monitor.custom_uptime_ranges
                                    }
                                    day={1}
                                    createTime={monitor.create_datetime}
                                />
                                <OverAllUptime
                                    customUptimeRanges={
                                        monitor.custom_uptime_ranges
                                    }
                                    day={7}
                                    createTime={monitor.create_datetime}
                                />
                                <OverAllUptime
                                    customUptimeRanges={
                                        monitor.custom_uptime_ranges
                                    }
                                    day={30}
                                    createTime={monitor.create_datetime}
                                />
                                <OverAllUptime
                                    customUptimeRanges={
                                        monitor.custom_uptime_ranges
                                    }
                                    day={90}
                                    createTime={monitor.create_datetime}
                                />
                            </Grid>
                        </Paper>
                    </Box>
                </Box>
                <Footer />
            </Container>
            <StatusBar
                total={
                    account.account.up_monitors +
                    account.account.down_monitors +
                    account.account.paused_monitors
                }
                available={account.account.up_monitors}
            />
        </>
    );
}
