import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography, Button, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { getCustomers, getInventory, getOrders, getRevenue } from "../../API";
import Calendar from "react-calendar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-calendar/dist/Calendar.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [editorHtml, setEditorHtml] = useState('');

  const handleChange = (html) => {
    setEditorHtml(html);
  };


  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.total);
      setRevenue(res.discountedTotal);
    });
    getInventory().then((res) => {
      setInventory(res.total);
    });
    getCustomers().then((res) => {
      setCustomers(res.total);
    });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('Uploaded file:', file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      {/* 50% Width Section */}
      <div style={{ flex: "50%", border: "1px solid black" }}>
        <Space size={20} direction="vertical">
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography.Title level={4}></Typography.Title>
          <Typography.Title level={4}>Account Balance:1,00,000 Rs</Typography.Title>
          </div>
          <Space direction="horizontal">
            <DashboardCard
              icon={
                <ShoppingCartOutlined
                  style={{
                    color: "green",
                    backgroundColor: "rgba(0,255,0,0.25)",
                    borderRadius: 20,
                    fontSize: 24,
                    padding: 8,
                  }}
                />
              }
              title={"Today's Journal"}
              value={orders}
              onEdit={() => {
                // Add your edit logic here
              }}
              showCheckboxes={false} // Add this prop
              showTodaysJournal={true}
            />
            <DashboardCard
              icon={
                <ShoppingOutlined
                  style={{
                    color: "blue",
                    backgroundColor: "rgba(0,0,255,0.25)",
                    borderRadius: 20,
                    fontSize: 24,
                    padding: 8,
                  }}
                />
              }
              title={"My Rules"}
              value={inventory}
              onEdit={() => {
                // Add your edit logic here
              }}
              showCheckboxes={true} // Add this prop
              showTodaysJournal={false}
            />
          </Space>
          <RecentOrders/>
        </Space>
      </div>
      {/* 20% Width Empty Section */}
      <div style={{ flex: "20%", border: "1px solid black" }}>
      <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", justifyContent: "space-between", padding:5, margin:10 }}>
          <div>
            <h5>Add Trade</h5>
          </div>
          <div style={{ borderLeft: "1px solid black", paddingLeft: 30 }}>
            <h5>Import Trade</h5>
          </div>
        </div>
      <Calendar />

      <div>
        <div>
          <h3>Today's Performance</h3>
          <h5>Rule set for number of daily trade:4</h5>
        </div>

        <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", justifyContent: "space-between", padding:5, margin:10 }}>
          <div>
            <h5>No. of Trades</h5>
          </div>
          <div>
            <h5>4</h5>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", justifyContent: "space-between", padding:5, margin:10 }}>
          <div>
            <h5>Win Rate</h5>
          </div>
          <div>
            <h5>50% (Wining trades/Total Tardes)</h5>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", justifyContent: "space-between", padding:5, margin:10 }}>
          <div>
            <h5>Profit & Loss</h5>
          </div>
          <div>
            <h5>+7000</h5>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", border: "1px solid black", justifyContent: "space-between", padding:5, margin:10 }}>
          <div>
            <h5>Rules followed vs Rules broken(Total rules: 10)</h5>
          </div>
          <div>
            <h5>8/2</h5>
          </div>
        </div>
      </div>
      </div>
      {/* 30% Width Empty Section */}
      <div style={{ flex: "30%", border: "1px solid black" }}>
      <div style={{justifyContent:'center', alignItems:'center'}}>
        <h3>Today's Journal</h3>
      </div>
      <div>
      <ReactQuill 
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
      />
      <div>
        <h2>Editor HTML:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
      </div>
    </div>

    <div>
      <div>
        <h4>Attach Files</h4>
      </div>
      <div style={{ textAlign: 'center', margin: '20px auto', border: '2px dashed #999', padding: '20px', borderRadius: '5px' }}>
      <label htmlFor="fileUpload">
        <div>Add text to upload files</div>
        <input 
          type="file" 
          id="fileUpload" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
      </label>
    </div>
    </div>
    <DashboardChart />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, onEdit, showCheckboxes, showTodaysJournal  }) {
  return (
    <Card
    style={{ width: 250, height: 300, position: "relative" }}
    title={<Typography.Title level={4}>{title}</Typography.Title>}
    extra={
      <Button
        type="text"
        onClick={onEdit}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
       <img src={require("../../assets/pen.png")} alt="Edit" style={{width: 20, height: 20}} />
      </Button>
     
    }
  >
    <Space direction="horizontal">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        {/* {icon} */}
      </div>
      {/* <Statistic title={title} value={value} /> */}
      {showCheckboxes && (
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="Checkbox1">Checkbox 1</Checkbox>
              <Checkbox value="Checkbox2">Checkbox 2</Checkbox>
              <Checkbox value="Checkbox3">Checkbox 3</Checkbox>
            </Space>
          </Checkbox.Group>
        )}

        {showTodaysJournal && (
          <div>
            <h4>The Journal News, a daily newspaper in the Lower Hudson Valley of New York State. The Journal-News (Hillsboro, Illinois)</h4>
          </div>
        )}
    </Space>
  </Card>
  );
}
// function RecentOrders() {
//   const [dataSource, setDataSource] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     getOrders().then((res) => {
//       setDataSource(res.products.splice(0, 3));
//       setLoading(false);
//     });
//   }, []);

//   return (
//     <>
//       <Typography.Text>Trade Log</Typography.Text>
//       <Table
//         columns={[
//           {
//             title: "Title",
//             dataIndex: "title",
//           },
//           {
//             title: "Quantity",
//             dataIndex: "quantity",
//           },
//           {
//             title: "Price",
//             dataIndex: "discountedPrice",
//           },
//         ]}
//         loading={loading}
//         dataSource={dataSource}
//         pagination={false}
//       ></Table>
//     </>
//   );
// }

function RecentOrders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    getOrders().then((res) => {
      setDataSource(res.products);
      setLoading(false);
    });
  }, []);

  return (
    <Space size={20} direction="vertical">
      <div style={{display: "flex", justifyContent: "space-between"}}>
      <Typography.Title level={4}>Trade Log</Typography.Title>
      <Typography.Title level={4}>Add Trade</Typography.Title>
      </div>
      <Table
        loading={loading}
        columns={[
          {
            title: "Sr No",
            dataIndex: "title",
          },
          {
            title: "Instrument",
            dataIndex: "price",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Date",
            dataIndex: "discountedPrice",
            render: (value) => <span>${value}</span>,
          },
          {
            title: "Buy Price",
            dataIndex: "quantity",
          },
          {
            title: "Sell Price",
            dataIndex: "total",
          },
        ]}
        dataSource={dataSource}
        // pagination={{
        //   pageSize: 5,
        // }}
      ></Table>
    </Space>
  );
}

function DashboardChart() {
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getRevenue().then((res) => {
      const labels = res.carts.map((cart) => {
        return `User-${cart.userId}`;
      });
      const data = res.carts.map((cart) => {
        return cart.discountedTotal;
      });

      const dataSource = {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: data,
            backgroundColor: "rgba(255, 0, 0, 1)",
          },
        ],
      };

      setReveneuData(dataSource);
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Order Revenue",
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
    // <></>
  );
}
export default Dashboard;

{
  /* <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Customer"}
          value={customers}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }}
            />
          }
          title={"Revenue"}
          value={revenue}
        /> */
}
