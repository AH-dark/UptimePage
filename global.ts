interface GlobalType {
    ApiKeySplit: string;
    Debug: boolean;
}

export default function _Global(): GlobalType {
    return {
        ApiKeySplit: process.env.APIKEY_SPLIT ?? ":",
        Debug: process.env.DEBUG == "true",
    };
}