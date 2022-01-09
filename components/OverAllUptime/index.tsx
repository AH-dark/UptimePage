import React from "react";
import AvailablePercent from "../../libs/AvailablePercent";
import { Grid, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles, useTheme } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
        },
    })
);

export default function OverAllUptime(props: {
    customUptimeRanges: string;
    day: number;
    createTime: number;
}) {
    const percent = AvailablePercent(
        props.customUptimeRanges,
        props.day,
        props.createTime
    );
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    return (
        <Grid item={true} className={classes.root} xs={6} md={4}>
            <Typography
                variant={"h6"}
                component={"span"}
                fontWeight={"bold"}
                display={"block"}
            >
                {percent + "%"}
            </Typography>
            <Typography
                variant={"body1"}
                component={"span"}
                color={"#687790"}
                display={"block"}
            >
                {props.day == 1 ? "Last 24 hours" : `Last ${props.day} days`}
            </Typography>
        </Grid>
    );
}
