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
