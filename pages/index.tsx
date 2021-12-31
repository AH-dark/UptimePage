import Head from "next/head";
import { Config } from "../config";
import {
    Box,
    Container,
    CssBaseline,
    Paper,
    Theme,
    Typography,
} from "@mui/material";
import api from "../middleware/API";
import { createStyles, makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { Monitor } from "../types/Monitor";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import StatusCard from "../components/StatusCard";

export const getStaticProps: () => Promise<{
    props: { data: Monitor };
}> = async () => {
    const monitorsData = await api.post("/getMonitors", {
        params: {
            all_time_uptime_ratio: 1,
            logs: 1,
        },
    });
    console.log(monitorsData.data);
    return {
        props: {
            data: monitorsData.data,
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
            padding: 60,
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
            padding: 60,
            boxShadow: "0 20px 60px rgb(0 0 0 / 10%)",
            marginTop: theme.spacing(1.5),
        },
    })
);

export default function Home({ data, time }) {
    const classes = useStyles();

    console.log(data);
    const monitors = data.monitors;
    const isAllOperational: Boolean =
        data.pagination.offset === 0 || data.pagination.total === 0;

    return (
        <>
            <Head>
                <title>{Config.siteName}</title>
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
                    {!isAllOperational && (
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
                    {isAllOperational && (
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
                    )}
                </Paper>
                <Box component={"section"}>
                    <Typography
                        variant={"h4"}
                        component={"h2"}
                        fontWeight={"bold"}
                    >
                        {"Uptime"}
                    </Typography>
                    <Paper className={classes.paper}>
                        {monitors.map((monitor) => (
                            <StatusCard monitor={monitor} />
                        ))}
                    </Paper>
                </Box>
            </Container>
        </>
    );
}
