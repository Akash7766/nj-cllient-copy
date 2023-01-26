import axios from "axios";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "react-router-dom";
import auth from "../firebase.init";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // Queries
  const getUsers = async () => {
    const { data } = await axios.get("http://localhost:5000/api/v1/user");
    return data;
  };
  const { data: databaseUser, isLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: getUsers,
  });
  const [user, Loading] = useAuthState(auth);

  const visitor = databaseUser?.data?.find((u) => u.email === user.email);
  const isAdmin = visitor?.role;
  return (
    <>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            padding: 24,
            minHeight: 600,
            background: colorBgContainer,
          }}
        >
          <div className="logo grid justify-center mb-5">
            <Link to="/">
              <img
                className="w-36"
                src="https://restored316.wpenginepowered.com/wp-content/uploads/2020/09/R316_horizontal.png"
                alt=""
              />
            </Link>
          </div>
          <Menu
            theme="lite"
            onClick={(e) => {
              navigate(e.key);
            }}
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "profile",
                icon: <UserOutlined />,
                label: "Profile",
              },
              {
                key: "slider",
                icon: <VideoCameraOutlined />,
                label: "Slider",
              },
              {
                key: "project",
                icon: <UploadOutlined />,
                label: "Project",
              },
              {
                key: "instagram",
                icon: <UploadOutlined />,
                label: "instagram",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 600,
              background: colorBgContainer,
            }}
          >
            {<Outlet />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;