## 问ChatGPT的问题

现在要用 Next.js 与 chakra.ui 建`whois`站，根据如下描述，写出`src/pages/index.js`的代码

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



## GPT 回答示例

> 注：回答不唯一

https://chat.openai.com/share/b266f030-d927-4d62-b805-e2eddec3a05b

```jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Container,
  Heading,
  useToast
} from '@chakra-ui/react';

const Home = () => {
  const [domain, setDomain] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    // 简单的验证
    if (!domain) {
      toast({
        title: '错误',
        description: "请输入域名",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    // 使用 useRouter 的 push 方法跳转到 /whois/[domain]
    router.push(`/whois/${domain}`);
  };

  return (
    <Container centerContent>
      <Box p={4} maxWidth="lg">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          域名搜索
        </Heading>
        <form onSubmit={handleSubmit}>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="输入域名"
              onChange={(e) => setDomain(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleSubmit}>
                搜索
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </Container>
  );
};

export default Home;

```

### 化简

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
