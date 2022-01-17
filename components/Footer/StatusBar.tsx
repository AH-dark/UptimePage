import React from "react";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import {
    AppBar,
    Box,
    Divider,
    Theme,
    Toolbar,
    Typography,
} from "@mui/material";
import { CircleRounded as CircleRoundedIcon } from "@mui/icons-material";
import _Global from "../../global";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            top: "auto",
            bottom: 0,
            backgroundColor: "#000000",
            maxHeight: theme.spacing(4),
        },
        toolbox: {
            minHeight: theme.spacing(4),
            justifyContent: "flex-end",
            "& p": {
                fontSize: 12,
            },
            "& > div": {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
            },
        },
        icon: {
            height: 16,
            width: 16,
        },
    })
);

export default function StatusBar(props: {
    total: number;
    available?: number;
}) {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    return (
        <AppBar
            position={"fixed"}
            color={"primary"}
            className={classes.root}
            component={"div"}
        >
            <Toolbar variant="dense" className={classes.toolbox}>
                <Box>
                    <Typography variant={"body2"}>
                        {"Total " + props.total.toString()}
                    </Typography>
                </Box>
                <Divider
                    variant={"middle"}
                    orientation="vertical"
                    flexItem={true}
                />
                <Box display={"inline-flex"}>
                    <CircleRoundedIcon
                        style={{ color: _Global().Color.Available }}
                        className={classes.icon}
                    />
                    <Typography variant={"body2"} ml={1}>
                        {"Up "}
                        {props.available.toString()}
                    </Typography>
                </Box>
                <Divider
                    variant={"middle"}
                    orientation="vertical"
                    flexItem={true}
                />
                <Box display={"inline-flex"}>
                    <CircleRoundedIcon
                        style={{ color: _Global().Color.Unavailable }}
                        className={classes.icon}
                    />
                    <Typography variant={"body2"} ml={1}>
                        {"Down "}
                        {(props.total - props.available).toString()}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
