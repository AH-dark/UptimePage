import axios from "axios";
import dayjs from "dayjs";

const Endpoint = "https://api.uptimerobot.com/v2/";

export const GetEndpoint = () => {
    return Endpoint;
};

const instance = axios.create({
    baseURL: GetEndpoint(),
    withCredentials: false,
    headers: {
        "cache-control": "no-cache",
        "content-type": "application/json",
    },
    params: {
        _: dayjs().valueOf(),
    },
});

export default instance;
