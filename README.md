现在要用 Next.js 与 chakra.ui 建`whois`站，类似网站示例：https://whois.gantrol.com

目标演示如何是用最少、必要的知识，快速开发、部署一个网站。

相关账号：

- [Vercel注册](https://vercel.com/signup)
- [Github注册](https://github.com/join)

> 这两个网站的注册过程可参考：[不用开发，如何 10 分钟上线一个 AI 产品](https://mp.weixin.qq.com/s/N0Puxv0X2D6eC5q_Ps8uLQ)

[ChatGPT](https://chat.openai.com/)账号可选。

目前进度：完成基本设计、搭建项目框架。你可以：

- 部署到 Vercel： [![部署到 Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gantrol/whois-nextjs&project-name=whois-nextjs&repository-name=whois-nextjs)
- 用Github在线编辑器打开：[![用Github在线编辑器打开](https://github.com/codespaces/badge.svg)](https://codespaces.new/gantrol/whois-nextjs)
- fork 为自己的项目（注意修改上述两个按钮的链接）

后续步骤（对应节点链接，均可一键开发或部署）：

1. [实现主页](https://github.com/gantrol/whois-nextjs/tree/step1)
2. [实现后端接口（转发freeaiapi）](https://github.com/gantrol/whois-nextjs/tree/step2)
3. [实现搜索结果页](https://github.com/gantrol/whois-nextjs/tree/step3)
4. [实现缓存](https://github.com/gantrol/whois-nextjs/tree/step4)

## 基本分析

### 用户案例

假设用户想要一个带 gantrol 的域名，比较想要 gantrol.com，用户主要想得到什么情报呢？

- 这个域名的信息，最主要的是，有没有被注册、是否能买到
- 有没有相关域名可以注册

### 界面概设

- 主页主体是Google极简风格的搜索框，商标位置先用文字“域名搜索”替代
- 用户搜索`gantrol.com` 后，网站跳转到`/whois/gantrol.com`，然后页面顶端是搜索框，其下是具体的域名信息

### 外部api

```markdown
https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}
```

示例：要查询 gantrol.com，被拆分为 http://whois.freeaiapi.xyz/?name=gantrol&suffix=com ，点击链接即可访问

请求的返回分为两种：

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

## 核心代码文件

> 目前为代码结构框架，会在其他分支更新代码

- src/pages/index.js：网站主页
- src/pages/api/whois.js：后端接口，用于转发外部接口
- src/pages/whois/[domain].js：搜索详情页

