import React from "react";
import { createStyles, makeStyles, useTheme } from "@mui/styles";
import { Theme } from "@mui/system";
import { Box, Link, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Config } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: "center",
            paddingBottom: theme.spacing(10),
        },
    })
);

export default function Footer() {
    const theme: Theme = useTheme<Theme>();
    const classes = useStyles(theme);

    const now = dayjs;
    const yearNow: number = now().year();
    const yearStart: number = 2021;
    let copyrightDate: string;
    if (yearNow > 2021) {
        copyrightDate = yearStart + "-" + yearNow;
    } else {
        copyrightDate = yearStart.toString();
    }

    return (
        <Box component={"footer"} className={classes.root}>
            <Typography variant={"body2"}>
                {"Copyright © " + copyrightDate + " "}
                <Link href={"/"} target={"_self"} underline={"none"}>
                    {Config.siteName}
                </Link>
                {" All right reserved."}
            </Typography>
            {/* 版权声明严禁修改！ */}
            <Typography variant={"body2"}>
                {"Powered by "}
                <Link
                    href={"https://github.com/AH-dark/UptimePage"}
                    target={"_blank"}
                    underline={"none"}
                    rel={"noopener"}
                >
                    {"AH-dark/UptimePage"}
                </Link>
                {"."}
            </Typography>
        </Box>
    );
}
