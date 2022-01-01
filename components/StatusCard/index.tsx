import React from "react";
import { MonitorElement } from "../../types/Monitor";
import {
    Box,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    Zoom,
} from "@mui/material";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import dayjs from "dayjs";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            borderBottom: "1px solid #e6e7e8",
            marginBottom: 30,
            paddingBottom: 30,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            "last-of-type": {
                border: 0,
                marginBottom: 0,
                paddingBottom: 0,
            },
        },
        header: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
        },
        text: {
            display: "flex",
            alignItems: "baseline",
            [theme.breakpoints.up("sm")]: {
                flexDirection: "row",
            },
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
            },
            flexWrap: "nowrap",
        },
        availability: {
            fontSize: 20,
            color: "#3bd671",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(1),
            },
        },
        status: {
            display: "inline-flex",
        },
        statusIcon: {
            fontSize: 30,
        },
        statusText: {
            marginLeft: theme.spacing(1),
            [theme.breakpoints.down("sm")]: {
                display: "none",
            },
        },
        iconArea: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "space-evenly",
            width: "100%",
            paddingTop: theme.spacing(2),
        },
        icon: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
        },
    })
);

const getTime: (day: number) => string = (day: number) => {
    return dayjs().subtract(day, "day").format("MMMM DD").toString();
};

const getTimestamp: (day: number) => number = (day: number) => {
    return dayjs().subtract(day, "day").unix();
};

export default function StatusCard(props: { monitor: MonitorElement }) {
    const monitor = props.monitor;
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    const customUptimeList = monitor.custom_uptime_ranges.split("-").reverse();
    let customUptime: Array<number> = [];

    let sum = 0;
    for (let i = 0; i < customUptimeList.length; i++) {
        let v = parseFloat(customUptimeList[i]);
        customUptime.push(v);
        sum += v;
    }
    const availablePercent = (sum / customUptimeList.length).toFixed(2);

    let match: number;
    const widthSm = useMediaQuery(theme.breakpoints.down("sm"));
    const widthMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const widthLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const widXl = useMediaQuery(theme.breakpoints.between("lg", "xl"));

    if (widthSm) {
        match = 1;
    } else if (widthMd) {
        match = 2;
    } else if (widthLg) {
        match = 3;
    } else if (widXl) {
        match = 4;
    } else {
        match = 5;
    }

    const matchToSize = [30, 23, 18, 6, 0, 0];
    const iconNum = matchToSize[match];

    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <Box className={classes.text}>
                    <Typography
                        variant={"h5"}
                        component={"h3"}
                        display={"inline-flex"}
                    >
                        {monitor.friendly_name}
                    </Typography>
                    <Typography
                        variant={"body1"}
                        component={"span"}
                        className={classes.availability}
                        display={"inline-flex"}
                    >
                        {availablePercent + "%"}
                    </Typography>
                </Box>
                <Box className={classes.status}>
                    {monitor.status === 2 ? (
                        <>
                            <CheckCircleIcon
                                className={classes.statusIcon}
                                style={{ color: "#3bd671" }}
                            />
                            <Typography
                                variant={"h6"}
                                component={"span"}
                                className={classes.statusText}
                                style={{ color: "#3bd671" }}
                            >
                                {"Operational"}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <ErrorIcon
                                className={classes.statusIcon}
                                style={{ color: "#d30e0e" }}
                            />
                            <Typography
                                variant={"h6"}
                                component={"span"}
                                className={classes.statusText}
                                style={{ color: "#d30e0e" }}
                            >
                                {"Down"}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
            <Box className={classes.iconArea}>
                {customUptime.map((value, index) => {
                    let iconColor: string;
                    let fillOpacity: number = 1;
                    let title: string;

                    if (index < iconNum) {
                        return;
                    }

                    if (
                        getTimestamp(customUptime.length - index - 1) >=
                        monitor.create_datetime
                    ) {
                        title =
                            getTime(customUptime.length - index - 1) +
                            ": " +
                            value +
                            "%";

                        if (value === 100) {
                            iconColor = "#3bd671";
                        } else if (value >= 99) {
                            iconColor = "#3bd671";
                            fillOpacity = 0.5;
                        } else if (value >= 95) {
                            iconColor = "#f29030";
                        } else {
                            iconColor = "#df484a";
                        }
                    } else {
                        title =
                            getTime(customUptime.length - index - 1) +
                            ": " +
                            "Record does not exist.";
                        iconColor = "#687790";
                    }

                    return (
                        <Tooltip
                            title={title}
                            arrow={true}
                            TransitionComponent={Zoom}
                        >
                            <CircleRoundedIcon
                                className={classes.icon}
                                style={{
                                    color: iconColor,
                                    fillOpacity: fillOpacity,
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </Box>
        </Box>
    );
}
