import "@fontsource/roboto";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

export const theme = createTheme({
    spacing: (factor) => `${0.5 * factor}rem`, // (Bootstrap strategy)
});

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
