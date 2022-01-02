# UptimePage
Static Page for UptimeRobot. Powered by Next.js

---

## 配置

配置文件都位于 `config.ts` 中，你可以Fork仓库后自行修改配置。

|     **变量名**     |         **描述**          |                 **样例**                  |
|:---------------:|:-----------------------:|:---------------------------------------:|
| Config.siteName |           站点名           |              AHdark Status              |
|   Config.logo   |         站点Logo          | https://q2.a1pic.cn/2022/01/01/gtUy.jpg |
|      Debug      |          调试模式           |                  false                  |

### API Key

请自行前往<https://uptimerobot.com/>获取只读权限的API Key，全读写权限将有安全隐患。

**API Key需要配置在环境变量中**，你可以在Vercel部署时添加环境变量，或在项目根目录下添加`.env`文件。

> 原有在`config.js`中配置API Key并不足够安全，或者说无法给用户带来足够的安全感，即使是使用只读权限的Key。

你可以同时使用多个API Key，只需使用`:`分隔每个API Key即可。

> 通过环境变量`APIKEY_SPLIT`可以自定义分隔符，比如你可以设置为`114514`，但我不建议你这么搞。

### Debug

设置环境变量`DEBUG`为`true`即可开启Debug模式，开启后Console将显示部分请求的详细信息。

## 开发进度

请前往 Project 栏目查看：<https://github.com/AH-dark/UptimePage/projects/1>

## License

MIT License

Copyright (c) 2021 AHdark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**严禁移除底部版权标识**
