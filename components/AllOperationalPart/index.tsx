import React from "react";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import { Box, Paper, Theme, Typography, useMediaQuery } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import _Global from "../../global";

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
            color: _Global().Color.Available,
            marginRight: theme.spacing(3),
            fontSize: 70,
        },
        statIconUnavailable: {
            color: _Global().Color.Unavailable,
            marginRight: theme.spacing(3),
            fontSize: 70,
        },
    })
);

function CheckText(props: { checkTime: number }) {
    const TimeToText = (checkTime: number): string => {
        switch (true) {
            case checkTime <= 1:
                return checkTime.toString() + " second";
            case checkTime < 60:
                return checkTime.toString() + " seconds";
            case checkTime == 60:
                return parseInt((checkTime / 60).toString()) + " minute";
            case checkTime < 3600:
                return parseInt((checkTime / 60).toString()) + " minutes";
            case checkTime == 3600:
                return parseInt((checkTime / 3600).toString()) + " hour";
            case checkTime < 86400:
                return parseInt((checkTime / 3600).toString()) + " hours";
            case checkTime == 86400:
                return parseInt((checkTime / 86400).toString()) + " day";
            case checkTime < 2592000:
                return parseInt((checkTime / 86400).toString()) + " days";
            default:
                return checkTime.toString() + " seconds";
        }
    };

    return (
        <Typography
            variant={"body1"}
            component={"span"}
            fontWeight={"normal"}
            color={"#687790"}
        >
            Checked every {TimeToText(props.checkTime)}.
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
                                    color: _Global().Color.Available,
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
