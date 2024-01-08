import { Box, Flex, Text, Alert, AlertIcon } from "@chakra-ui/react";

export default function Whois({ domainInfo, error }) {
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

export async function getServerSideProps(context) {
    const domain = context.query.domain;
    let domainInfo = null;
    let error = null;

    if (domain) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/whois?domain=${domain}`);
            domainInfo = await res.json();
        } catch (err) {
            console.error("Error fetching domain info:", err);
            error = "无法获取域名信息，请稍后重试。";
        }
    }

    return {
        props: { domainInfo, error }, // 将会被传递给页面组件作为props
    };
}
