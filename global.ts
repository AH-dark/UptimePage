interface GlobalType {
    ApiKeySplit: string;
    Debug: boolean;
    Color: {
        Available: string;
        Unavailable: string;
        Warning: string;
    };
}

export default function _Global(): GlobalType {
    return {
        ApiKeySplit: process.env.APIKEY_SPLIT ?? ":",
        Debug: process.env.DEBUG == "true",
        Color: {
            Available: "#3bd671",
            Unavailable: "#d30e0e",
            Warning: "#f29030"
        }
    };
}
