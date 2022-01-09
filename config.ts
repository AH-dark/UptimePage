import { ConfigType } from "./types/ConfigType";

export const Config: ConfigType = {
    siteName: "AHdark Status",
    apikey: process.env
        .APIKEY /* 请设置环境变量[APIKEY]以实现，你也可以在根目录下创建.env文件 */,
    logo: "https://q2.a1pic.cn/2022/01/01/gtUy.jpg",
    usePage: true,
};
