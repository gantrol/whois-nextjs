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
