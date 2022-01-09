import React from "react";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import { Box, Paper, Theme, Typography, useMediaQuery } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    })
);

function CheckText(props: { checkTime: number }) {
    let _time: string;
    const checkTime = props.checkTime;
    if (checkTime <= 1) {
        _time = checkTime.toString() + " second";
    } else if (checkTime < 60) {
        _time = checkTime.toString() + " seconds";
    } else if (checkTime == 60) {
        _time = parseInt((checkTime / 60).toString()) + " minute";
    } else if (checkTime < 3600) {
        _time = parseInt((checkTime / 60).toString()) + " minutes";
    } else if (checkTime == 3600) {
        _time = parseInt((checkTime / 3600).toString()) + " hour";
    } else if (checkTime < 86400) {
        _time = parseInt((checkTime / 3600).toString()) + " hours";
    } else if (checkTime == 86400) {
        _time = parseInt((checkTime / 86400).toString()) + " day";
    } else if (checkTime < 2592000) {
        _time = parseInt((checkTime / 86400).toString()) + " days";
    } else {
        _time = checkTime.toString() + " seconds";
    }
    return (
        <Typography
            variant={"body1"}
            component={"span"}
            fontWeight={"normal"}
            color={"#687790"}
        >
            Checked every {_time}.
        </Typography>
    );
}

export default function AllOperationalPart(props: {
    name?: string; // 监视器名，为空则显示`All monitors`
    isOperational: boolean; // 是否可用
    check?: number; // 每NaN秒检查
}) {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    const isDisplayIcon: boolean = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Paper className={classes.pspHeadSec}>
            {props.isOperational ? (
                <>
                    {isDisplayIcon && (
                        <CheckCircleIcon
                            className={classes.statIconOperational}
                        />
                    )}
                    <Box>
                        <Typography
                            variant={"h4"}
                            component={"h2"}
                            fontWeight={"bold"}
                        >
                            {props.name ? props.name + " is" : "All systems"}{" "}
                            <span
                                style={{
                                    color: "#3bd671",
                                }}
                            >
                                operational
                            </span>
                        </Typography>
                        {props.check && <CheckText checkTime={props.check} />}
                    </Box>
                </>
            ) : (
                <>
                    {isDisplayIcon && (
                        <ErrorIcon className={classes.statIconUnavailable} />
                    )}
                    <Box>
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
                        {props.check && <CheckText checkTime={props.check} />}
                    </Box>
                </>
            )}
        </Paper>
    );
}
