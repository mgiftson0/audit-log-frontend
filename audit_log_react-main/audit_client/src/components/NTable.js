import React, { useState, useEffect } from "react";
import { Divider, Table, Checkbox } from "antd";
import moment from "moment";
const columns = [
  {
    title: "Index",
    dataIndex: "rnum",
    key: "0",
  },
  {
    title: "Audit Type",
    dataIndex: "AUDIT_TYPE",
    key: "1",
  },

  {
    title: "Username",
    dataIndex: "OS_USERNAME",
    key: "2",
  },
  {
    title: "User Host",
    dataIndex: "USERHOST",
    key: "3",
  },
  {
    title: "Session ID",
    dataIndex: "SESSIONID",
    key: "4",
  },
  {
    title: "Timestamp",
    dataIndex: "EVENT_TIMESTAMP",
    key: "5",
    render: (text) => moment(text).format("LLL"),
  },
  {
    title: "Action Name",
    dataIndex: "ACTION_NAME",
    key: "6",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "7",
  },
  //   {
  //     title: "Priveledge",
  //     dataIndex: "priv_used",
  //     key: "6",
  //   },
  //   {
  //     title: "Timestamp",
  //     dataIndex: "extended_timestamp",
  //     key: "7",
  //   },
  //   {
  //     title: "Entry ID",
  //     dataIndex: "entryid",
  //     key: "8",
  //   },
  // Add more columns as needed
];

const NTable = () => {
  const [tableData, setTableData] = useState([]);
  const [checkedList, setCheckedList] = useState(
    columns.map((item) => item.key)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/getMySQLData", {
          headers: {
            "x-api-key": "a2a119cd-e932-42a6-a28a-8516e629c0dc", // api key
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchData();
      console.log("fetched successfully");
    }, 10000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));

  return (
    <>
      <Divider>DBA AUDIT TRAIL</Divider>
      <Checkbox.Group
        value={checkedList}
        options={options}
        onChange={(value) => {
          setCheckedList(value);
        }}
      />

      <Table
        bordered={true}
        columns={newColumns}
        dataSource={tableData}
        loading={loading}
        style={{
          marginTop: 24,
        }}
      />
    </>
  );
};

export default NTable;
