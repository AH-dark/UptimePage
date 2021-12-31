import axios from "axios";
import dayjs from "dayjs";
import { Config } from "../../config";

const Endpoint = "https://api.uptimerobot.com/v2/";

export const GetEndpoint = () => {
    return Endpoint;
};

const instance = axios.create({
    baseURL: GetEndpoint(),
    withCredentials: false,
    headers: {
        "cache-control": "no-cache",
	    'content-type': 'application/json',
    },
    params: {
        _: dayjs().valueOf(),
        api_key: Config.apikey,
	    format: 'json'
    },
});

export default instance;
