import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Card, Modal, Select, DatePicker, Row, Col, } from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { Checkbox, } from 'antd';
//import 'antd/dist/antd.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [filters, setFilters] = useState({
    username: null,
    action: null,
    dateRange: null,
  });

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
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleCheckboxChange = (column, checked) => {
    // Handle checkbox change logic here
    console.log(`Checkbox for ${column} changed to ${checked}`);
};

const handleMoreOptions = () => {
    // Handle more options button click logic here
    console.log('More Options button clicked');
};


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Audit Type",
      dataIndex: "AUDIT_TYPE",
      key: "AUDIT_TYPE",
      ...getColumnSearchProps("AUDIT_TYPE"),
    },
    {
      title: "Username",
      dataIndex: "OS_USERNAME",
      key: "OS_USERNAME",
      ...getColumnSearchProps("OS_USERNAME"),
    },
    {
      title: "User Host",
      dataIndex: "USERHOST",
      key: "USERHOST",
      ...getColumnSearchProps("USERHOST"),
    },
    {
      title: "Session ID",
      dataIndex: "SESSIONID",
      key: "SESSIONID",
      ...getColumnSearchProps("SESSIONID"),
    },
    {
      title: "Timestamp",
      dataIndex: "EVENT_TIMESTAMP",
      key: "EVENT_TIMESTAMP",
      render: (text) => moment(text).format("LLL"),
      sorter: (a, b) =>
        moment(a.EVENT_TIMESTAMP).unix() - moment(b.EVENT_TIMESTAMP).unix(),
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "Action Name",
      dataIndex: "ACTION_NAME",
      key: "ACTION_NAME",
      ...getColumnSearchProps("ACTION_NAME"),
    },
    {
      title: "View Action",
      dataIndex: "",
      key: "ACTION",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showModal(record)}>
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleFilterApply = () => {
    // Apply filters to the data
    let filteredData = tableData;

    // Filter by username
    if (filters.username) {
      filteredData = filteredData.filter(
        (data) => data.OS_USERNAME === filters.username
      );
    }

    // Filter by action
    if (filters.action) {
      filteredData = filteredData.filter(
        (data) => data.ACTION_NAME === filters.action
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filteredData = filteredData.filter(
        (data) =>
          moment(data.EVENT_TIMESTAMP).isSameOrAfter(start) &&
          moment(data.EVENT_TIMESTAMP).isSameOrBefore(end)
      );
    }

    setTableData(filteredData);
  };

  const handleFilterClear = () => {
    // Clear the filters and reset the form controls
    setFilters({
      username: null,
      action: null,
      dateRange: null,
    });

    // Reset the table data by fetching the original data again
    // Alternatively, you can fetch the data again to get the original data set
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

    fetchData();
  };

  return (
    <div>


      {/* Header Card 
    <Card
  style={{
    width: "200px", 
    padding: "10px",
    backgroundColor: "#FFFFFF",
    //boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
    position: "fixed", 
    zIndex: 1000, 
  }}
>
  <h2 style={{ margin: 0, color:"gray"}}>Audit Table</h2>
</Card>  */}


<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>


    {/* Filters Card */}
<Card
   style={{
    width: "100%",
    //height: "50px",
   // padding: "10px", 
    backgroundColor: "#FFFFFF",
   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
  }}
>

  <Row gutter={16}>
    {/* Username Dropdown */}
    <Col span={6}>
      <Select
        placeholder="Select Username"
        style={{ width: "100%" }}
        onChange={(value) => handleFilterChange("username", value)}
      >
        <Option value="username1">Username 1</Option>
        <Option value="username2">Username 2</Option>
      </Select>
    </Col>

    {/* Action Dropdown */}
    <Col span={6}>
      <Select
        placeholder="Select Action"
        style={{ width: "100%" }}
        onChange={(value) => handleFilterChange("action", value)}
      >
        <Option value="action1">Action 1</Option>
        <Option value="action2">Action 2</Option>
      </Select>
    </Col>

    {/* Date Range Picker */}
    <Col span={6}>
      <RangePicker
        style={{ width: "100%" }}
        onChange={(dates) => handleFilterChange("dateRange", dates)}
      />
    </Col>

    {/* Filter Button */}
    <Col span={3}>
      <Button
        type="primary"
        style={{ width: "100%" }}
        onClick={handleFilterApply}
      >
        Filter
      </Button>
    </Col>

    {/* Clear Button */}
    <Col span={3}>
      <Button
        danger
        style={{ width: "100%" }}
        onClick={handleFilterClear}
      >
        Clear
      </Button>
    </Col>
  </Row>
</Card>
<br></br>

 {/* Column Card */}
 <Card
    style={{
        width: "100%",
        //height: "50px",
        marginBottom: "20px",
        backgroundColor: "#FFFFFF",
         boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
        //padding: "5px 10px", 
    }}
>
    <Space size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 'bold' }}>
            Column Selector:
        </div>

        {/* Checkboxes */}
        <Space size="middle">
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column1', e.target.checked)}
    >
        Column 1
    </Checkbox>
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column2', e.target.checked)}
    >
        Column 2
    </Checkbox>
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column3', e.target.checked)}
    >
        Column 3
    </Checkbox>
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column4', e.target.checked)}
    >
        Column 4
    </Checkbox>
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column5', e.target.checked)}
    >
        Column 5
    </Checkbox>
    <Checkbox 
        style={{ marginRight: 10, fontSize: '1.15em' }}
        onChange={(e) => handleCheckboxChange('column6', e.target.checked)}
    >
        Column 6
    </Checkbox>
</Space>

        <Button type="default" onClick={handleMoreOptions}>
            More Options
        </Button>
    </Space>
</Card>

    <br></br>

      {/*  Table and Modal */}
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        style={{
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
        }}
      />
    
      <Modal
        title="View Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/*  content of the modal here */}
        {/* You can use selectedRecord to display details related to the clicked row */}
        {selectedRecord && <p>Details for row: {selectedRecord.rnum}</p>}
      </Modal>
    </div>
  );
};

export default App;
