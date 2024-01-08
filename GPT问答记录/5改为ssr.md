# 5改为ssr（后端渲染）

## 问ChatGPT的问题

把它改为 ssr (Server-Side Rendering (SSR) using Next.js,) ，用中文回答。

若用到API的“非相对路径”，请列出具体如何配置.env文件

```jsx
import { Box, Flex, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Whois() {
    const router = useRouter();
    const { domain } = router.query;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [domainInfo, setDomainInfo] = useState(null);

    useEffect(() => {
        if (domain) {
            setLoading(true);
            fetch(`/api/whois?domain=${domain}`)
                .then(res => res.json())
                .then(data => {
                    setDomainInfo(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching domain info:", error);
                    setError("无法获取域名信息，请稍后重试。");
                    setLoading(false);
                });
        }
    }, [domain]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Flex direction="column" align="center" p={5}>
            <Text fontSize="xl" mb={2}>域名信息查询结果</Text>
            {domainInfo && (
                <Box p={4} borderWidth="1px" borderRadius="lg">
                    <Text><b>域名:</b> {domainInfo.domain}</Text>
                    <Text><b>是否可注册:</b> {domainInfo.available ? "是" : "否"}</Text>
                    {domainInfo.creation_datetime && (
                        <Text><b>创建时间:</b> {domainInfo.creation_datetime}</Text>
                    )}
                    {domainInfo.expiry_datetime && (
                        <Text><b>过期时间:</b> {domainInfo.expiry_datetime}</Text>
                    )}
                    <Text><b>详细信息:</b></Text>
                    <Text whiteSpace="pre-wrap">{domainInfo.info}</Text>
                </Box>
            )}
        </Flex>
    );
}

```


## GPT 回答示例

> 注：回答不唯一

要将这段代码改为使用 Next.js 进行服务器端渲染（SSR），你需要做以下几个主要的改动：

1. **使用`getServerSideProps`:** 这是 Next.js 提供的一个用于服务器端渲染的函数。通过此函数，你可以在页面渲染之前获取数据，并将其作为 props 传递给页面。

2. **移除`useEffect`和`useState`:** 因为我们将在服务器端获取数据，所以不需要在客户端使用这些 React 钩子。

3. **处理错误和加载状态:** 由于我们不再在客户端处理数据获取，所以需要在`getServerSideProps`中处理任何可能的错误，并在函数中返回这些状态。

以下是改写后的代码示例：

```jsx
import { Box, Flex, Text, Alert, AlertIcon } from "@chakra-ui/react";
import fetch from 'node-fetch'; // 引入 node-fetch 或者其他服务器端请求库

export default function Whois({ domainInfo, error }) {
    // 页面的 UI 部分基本保持不变
    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Flex direction="column" align="center" p={5}>
            <Text fontSize="xl" mb={2}>域名信息查询结果</Text>
            {domainInfo && (
                <Box p={4} borderWidth="1px" borderRadius="lg">
                    {/* 相关内容展示 */}
                </Box>
            )}
        </Flex>
    );
}

export async function getServerSideProps(context) {
    const { domain } = context.query;
    try {
        const res = await fetch(`[API_ENDPOINT]/api/whois?domain=${domain}`);
        const domainInfo = await res.json();
        return { props: { domainInfo } }; // 将数据作为 props 传递给页面
    } catch (error) {
        console.error("Error fetching domain info:", error);
        return { props: { error: "无法获取域名信息，请稍后重试。" } };
    }
}
```

**配置`.env`文件**：

- 如果你在`fetch`中使用了非相对路径（例如，直接请求`https://example.com/api/whois`而不是`/api/whois`），你需要在你的`.env.local`文件中设置环境变量。
- 创建`.env.local`文件（如果尚不存在）。
- 添加如下内容（根据你的API路径进行修改）：

  ```
  NEXT_PUBLIC_API_BASE_URL=https://example.com
  ```

- 然后你可以在代码中使用`process.env.NEXT_PUBLIC_API_BASE_URL`来引用这个环境变量，如：

  ```javascript
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/whois?domain=${domain}`);
  ```

这样，你就将客户端渲染改造为了服务端渲染（SSR），同时也处理了环境变量的设置。

## 注

由于`.env`文件有时会含有密码之类的隐私，不应当纳入到代码版本控制之中，尤其是开源项目。因此，本项目也不会有.env文件，而是用.env-sample作为示例。

你可以直接复制.env-sample文件，然后将复制文件改名为.env。部署到vercel时也要配置对应的环境变量。

![img.png](assets/img.png)
