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
