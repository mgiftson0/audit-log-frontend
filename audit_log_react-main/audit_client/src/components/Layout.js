import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  PieChartOutlined,
  SettingOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Overview from "./Overview";
import DTable from "./DTable";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const LayoutComponent = () => {
    const [activePage, setActivePage] = useState("overview");

    const handleMenuClick = (e) => {
        setActivePage(e.key);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    background: "#414d59",
                    width: "absolute",
                    height: "60px",
                    cursor:"pointer",
                }}
            >
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["overview"]}
                    style={{ lineHeight: "64px" }}
                >
                    <Title
                        style={{
                            fontSize: "30px",
                            paddingTop: "10px",
                            fontFamily: "serif",
                            color: "white",
                            margin: 0,
                            backgroundColor: "#414d59"
                        }}
                    >
                        AUDIT lOG
                    </Title>
                </Menu>
            </Header>
            <Layout>
            <Sider
    width={250}
    style={{
        overflowY: "auto",
        height: "absolute",
        background: "linear-gradient(#28282F, #28282F)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    }}
>
   

    <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["overview"]}
        style={{
            background: "none",
            paddingTop: "150px", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
        onClick={handleMenuClick}
    >
        <Menu.Item
            key="overview"
            icon={<PieChartOutlined style={{ fontSize: "27px" }} />}
            style={{ marginBottom: "15px", fontSize: '20px' }}
        >
            Overview
        </Menu.Item>
        <Menu.Item
            key="table"
            icon={<CalendarOutlined style={{ fontSize: "27px" }}/>}
            style={{ marginBottom: "15px", fontSize: '20px' }}
        >
            Table
        </Menu.Item>
        <Menu.Item
            key="settings"
            icon={<SettingOutlined style={{ fontSize: "27px" }} />}
            style={{ marginBottom: "15px", fontSize: '20px' }}
        >
            Settings
        </Menu.Item>
    </Menu>
    </Sider>

                <Layout>
                    <Content
                        style={{
                            padding: "24px",
                            marginTop: "20px",
                            minHeight: "calc(100vh - 64px - 20px)",
                            background: "#f0f2f5",
                        }}
                    >
                        {activePage === "overview" && <Overview />}
                        {activePage === "table" && <DTable />}
                        {activePage === "settings" && (
                            <div>
                                <h2>Settings Page</h2>
                                {/*<p>settings here.</p>*/}
                            </div>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;
