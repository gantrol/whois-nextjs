import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 86400 }); // 缓存24小时

export default async function handler(req, res) {
    const { domain } = req.query;
    if (!domain) {
        return res.status(400).json({ error: "缺少必要的参数：domain" });
    }

    // 尝试从缓存中获取数据
    const cachedData = myCache.get(domain);
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    // 缓存中没有数据，继续查询外部API
    const [name, suffix] = domain.split(".");
    const apiUrl = `https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // 将数据存储到缓存中
        myCache.set(domain, data);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "服务器错误，无法获取域名信息" });
    }
}
