import React from "react";
import { MonitorElement } from "../../types/Monitor";
import { Box, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

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
        },
        header: {
            display: "flex",
            flexWrap: "wrap",
        },
        text: {},
    })
);

export default function StatusCard(props: { monitor: MonitorElement }) {
    const monitor = props.monitor;
    const classes = useStyles();

    return (
        <>
            <Box className={classes.root}>
                <Box className={classes.header}>
                    <Box className={classes.text}>
                        <Typography variant={"h5"} component={"h3"}>
                            {monitor.friendly_name}
                        </Typography>
                        <Typography
                            variant={"body1"}
                            component={"span"}
                        ></Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
