import axios, { AxiosInstance } from "axios";
import dayjs                    from "dayjs";

const Endpoint: string = "https://api.uptimerobot.com/v2/";

export const GetEndpoint: () => string = () => {
    return Endpoint;
};

const instance: AxiosInstance = axios.create({
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
