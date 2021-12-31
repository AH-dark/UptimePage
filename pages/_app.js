import "@fontsource/roboto";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

export const theme = createTheme();

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
