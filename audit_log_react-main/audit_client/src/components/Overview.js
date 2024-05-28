import React from "react";
import { Card, Row, Col } from "antd";
import { UserOutlined, DeleteFilled , UserSwitchOutlined } from '@ant-design/icons';
import { LineChart } from "@mui/x-charts/LineChart";
import { FaUser } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Avatar } from 'antd';

const Overview = () => {
    return (
        <div style={{ padding: "16px" }}>

            {/* Header Container */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                        width: "150px",
                        height: "70px",
                        textAlign: "center",
                        margin:"16px",
                        color:"gray",
                        fontSize:"17px",
                    }}
                >
                    <h2>Overview</h2>
                </div>

                {/* Icon Card */}
                <Card
                    style={{
                        padding: "16px",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        width: "150px",
                        height: "70px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* FaUser icon */}
                    <FaUser style={{ fontSize: "30px", color:"gray", cursor:"pointer"  }} />
                    <IoIosNotifications style={{ fontSize: "35px", color:"gray audit",cursor:"pointer" }} />
                </Card>
            </div>

            {/* Main Content: Card and Line Chart Containers */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", cursor:"pointer" }}>
                <div style={{ flex: 1 }}>


                    {/* Card Container */}
                    <div
                        style={{
                            padding: "16px",
                           // backgroundColor: "#fffff",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            maxWidth: "100%",
                            marginBottom: "24px"
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color:"gray",
                                                fontSize:"24px"

                                            }}
                                        >
                                            <UserSwitchOutlined  style={{ marginRight: "8px", fontSize:"40", color:"blue", }} />  <strong>Sessions</strong>
                                        </div>
                                    }
                                    bordered={false}
                                    style={{
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                        padding: "12px",
                                        border: "none",
                                        
                                        background: "linear-gradient(to right, #9BE7F2, #FFFFFF)",
                                    }}
                                >
                                    34
                                    
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color:"gray",
                                                fontSize:"24px",
                                                
                                            }}
                                        >
                                            <UserOutlined style={{ marginRight: "8px", color:"green",fontSize:"40", }} />  <strong>Logins</strong>
                                        </div>
                                    }
                                    bordered={false}
                                    style={{
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                        padding: "12px",
                                        border: "none",
                                        background: "linear-gradient(to right, #D1F29B, #FFFFFF)",
                                    }}
                                >
                                    45
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                //font:"extra-bolder",
                                                fontSize:"24px",
                                                color:"gray"

                                            }}
                                        >
                                            <DeleteFilled  style={{ marginRight: "8px", fontSize:"40", color:"red",fontSize:"30" }} /> <strong>Deletions</strong>
                                        </div>
                                    }
                                    bordered={false}
                                    style={{
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                        padding: "12px",
                                        border: "none",
                                        background: "linear-gradient(to right, #FB8EA1, #FFFFFF)",
                                    }}
                                >
                                    67
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    {/* Line Chart Container */}
                    <div
                        style={{
                            padding: "16px",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            maxWidth: "100%",
                        }}
                    >
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            height={400}
                            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                            grid={{ vertical: true, horizontal: true }}
                        />
                    </div>
                </div>

                {/* Right Side: Recent Users Card */}
                <div style={{ width: "30%" }}>
                <Card
    style={{
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        height: "100%",
        fontSize: "27px",
    }}
>

    <h3>Recent Users</h3>
    {/* Table with recent users */}
    <table style={{ width: "100%", borderCollapse: "collapse", color:'gray'}}>
    <thead>
        <tr>
            <th style={{ textAlign: "left", fontSize: "15px", padding: "8px", borderBottom: "1px solid #ddd", color:"black" }}>
                Username
            </th>
        </tr>
    </thead>
    <tbody>
        
        {/* List of usernames */}
        {['kofi.mensah', 'kofi.mensah', 'kofi.mensah', 'kofi.mensah', 'kofi.mensah', 'kofi.mensah', 'kofi.mensah'].map((username, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ display: "flex", alignItems: "center", fontSize: "25px", padding: "8px" }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: "8px", color:"blue"}} />
                    {username}
                </td>
            </tr>
        ))}
    </tbody>
</table>

</Card>

                </div>
            </div>
        </div>
    );
};

export default Overview;
