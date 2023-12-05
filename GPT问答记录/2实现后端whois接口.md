# 2实现后端whois接口

## 已经有了外部接口，为什么还要实现一个接口？

- 前端调用外部接口`freeaiapi.xyz`，会出现CORS错误，就是被 freeaiapi 禁止“跨域”了
- 可维护性。以后如果要对接多个外部的whois接口，可以只更改whois接口的内容，而不是

## 问ChatGPT的问题

现在要用 Next.js 与 chakra.ui 建`whois`站，根据如下描述，写出`src/pages/api/whois.js`的代码，使用js自带fetch实现

### 用户案例

假设用户想要一个带 gantrol 的域名，比较想要 gantrol.com，用户主要想得到什么情报呢？

- 这个域名的信息，最主要的是，有没有被注册、是否能买到
- 有没有相关域名可以注册

### 外部api

数据的结构决定代码的结构，必须了解数据，才能写出符合要求的代码。

```markdown
https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}
```

示例：查询 gantrol.com，被拆分为 whois.freeaiapi.xyz/?name=gantrol&suffix=com

请求的返回分为两种，不清楚怎么调用接口的同学也先别急，可以用<https://whois.gantrol.com> 确认一下。

- available = true

   ```json
   {
       "status": "ok",
       "name": "gantrol",
       "suffix": "com",
       "domain": "gantrol.com",
       "creation_datetime": "2020-10-29T04:08:52Z",
       "expiry_datetime": "2024-10-29T04:08:52Z",
       "available": false,
       "info": "   Domain Name: GANTROL.COM\r\n   Registry Domain ID: 2568931463_DOMAIN_COM-VRSN\r\n   Registrar WHOIS Server: whois.paycenter.com.cn\r\n  《省略几百词》 .\r\n"
   }
   ```

- available = false

   ```json
   {
       "status": "ok",
       "name": "gantrol",
       "suffix": "org",
       "domain": "gantrol.org",
       "creation_datetime": "",
       "expiry_datetime": "",
       "available": true,
       "info": "Domain not found.\r\n>>> Last update of WHOIS database: 2023-12-05T08:58:08Z <<<\r\n\r\nTerms of Use:..《省略几百词》.\r\n"
   }
   ```

### 基本界面设计

- 主页主体是Google极简风格的搜索框，商标位置先用文字“域名搜索”替代

- 用户搜索`gantrol.com` 后，网站跳转到`/whois/gantrol.com`，然后页面顶端是搜索框，其下是具体的域名信息

    - "available": true,

### 已有代码

#### index.js

```jsx
import {Flex, Heading, IconButton, Input} from "@chakra-ui/react";
import {SearchIcon} from "@chakra-ui/icons";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Home() {
    const [domain, setDomain] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (domain) {
            router.push(`/whois/${domain}`);
        }
    };

    return (
        <Flex
            direction="column"
            justify="center"
            align="center"
            height="100vh"
        >
            <Heading mb={4}>域名搜索</Heading>
            <Flex
                justify="center"
                align="center"
                // 添加间距
                gap="2"
            >
                <Input
                    placeholder="输入域名"
                    value={domain}
                    // 当输入框的值改变时，更改 domain 的值
                    onChange={(e) => setDomain(e.target.value)}
                    // 基础屏幕尺寸下宽度为 90%（适用于较小屏幕的移动设备），以及中等屏幕尺寸（如平板或小型桌面显示器）下的宽度为 400px
                    width={{base: "90%", md: "400px"}}
                />
                <IconButton
                    icon={<SearchIcon/>}
                    // 为按钮添加点击事件
                    onClick={handleSearch}
                />
            </Flex>
        </Flex>
    );
}


```

## GPT 回答示例

> 注：回答不唯一

https://chat.openai.com/share/61630b22-ac41-4dac-ae29-0067e5a4b0de

根据您的描述，我将为您编写 `src/pages/api/whois.js` 文件的代码。此代码将使用 JavaScript 的原生 `fetch` 函数从提供的 API 获取域名信息。我们将创建一个 API 路由，该路由将接收一个请求，解析请求中的域名和后缀，然后调用外部 API 以获取相应的 WHOIS 信息。

### `src/pages/api/whois.js` 代码

```javascript
// 导入 Next.js 的 API 路由支持
import { NextApiRequest, NextApiResponse } from "next";

// 处理 API 请求的函数
export default async function handler(req, res) {
    // 从查询字符串中获取域名和后缀
    const { domain } = req.query;

    // 检查是否提供了域名和后缀
    if (!domain) {
        return res.status(400).json({ error: "缺少必要的参数：domain" });
    }

    // 解析域名和后缀
    const [name, suffix] = domain.split(".");

    // 构建外部 API 请求的 URL
    const apiUrl = `https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`;

    try {
        // 使用 fetch 发送请求到外部 API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // 将获取到的信息返回给客户端
        res.status(200).json(data);
    } catch (error) {
        // 处理可能发生的错误
        res.status(500).json({ error: "服务器错误，无法获取域名信息" });
    }
}
```

### 说明

1. 这段代码首先从请求的查询字符串中提取 `domain` 参数。
2. 然后，将域名分割为名称和后缀，以匹配外部 API 的格式。
3. 我们使用 `fetch` 方法调用外部 API，并将返回的数据发送回客户端。
4. 如果在过程中发生错误，代码将返回一个错误响应。

### 集成到您的 Next.js 应用中

在将此代码添加到您的 Next.js 应用中后，您可以通过 `/api/whois?domain=gantrol.com` 这样的 URL 来测试 API 的功能。这应该返回 gantrol.com 域名的 WHOIS 信息。
