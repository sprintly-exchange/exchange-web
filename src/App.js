// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  UsergroupDeleteOutlined,
  HomeOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import AdminConfig from './components/admin/AdminConfig';
import DashBoard from './components/dashboard/DashBoard';
import Pickup from './components/pickup/Pickup';
import Delivery from './components/delivery/Delivery';
import CurrentTransactionsTable from './components/transactions/CurrentTransactionsTable';
import Flows from './components/flow/Flows';
import SignUpPage from './components/signup/SignUpPage';
import LoginPage from './components/Login/LoginPage';
import OrganizationManagement from './components/organization/OrganizationManagement';
import './global.css';
import './components/utils/App.less';
import './index.css';
import UserManagement from './components/organization/UserManagement';
import Processing from './components/processing/Processing';
import config from './config'; // Import the config file

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.clear();
  };

  const MainLayout = () => {
    const navigate = useNavigate();

    return (
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{ width: '10%' }}>
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', background: 'inherit' }}>
            <img src="sprintly.png" alt="Company Logo" style={{ width: '40px', height: '40px', marginBottom: '8px' }} />
            {!collapsed && <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '-4px' }}>printly</div>}
          </div>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={({ key }) => {
              if (key === 'Logout') {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            items={[
              {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
              },
              {
                key: '/transaction',
                icon: <DatabaseOutlined />,
                label: 'Transactions',
              },
              {
                key: '/pickup',
                icon: <ArrowRightOutlined />,
                label: 'Pickup Partner',
              },
              {
                key: '/delivery',
                icon: <DoubleRightOutlined />,
                label: 'Delivery Partner',
              },
              {
                key: '/processing',
                icon: <SyncOutlined />,
                label: 'Processing',
              },
              {
                key: '/flow',
                icon: <DeploymentUnitOutlined />,
                label: 'Business Flows',
              },
              {
                key: '/organizations',
                icon: <HomeOutlined />,
                label: 'Organizations',
              },
              {
                key: '/users',
                icon: <UsergroupDeleteOutlined />,
                label: 'Users',
              },
              {
                key: '/admin',
                icon: <SettingOutlined />,
                label: 'Settings',
              },
              {
                key: 'Logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
              },
            ]}
          />
        </Sider>
        <Layout style={{ height: '100vh' }}>
          <Header
            style={{
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              className="ant-button ant-button:hover"
              style={{ cursor: 'pointer' }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <div style={{ marginRight: '16px' }}>
              Welcome, {user?.name}! <span style={{ marginLeft: '20px', fontSize: '12px', color: '#999' }}>Version: {config.version}</span>
            </div>
          </Header>
          <Content style={{ margin: '0 16px', overflow: 'auto' }}>
            <Routes>
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/pickup" element={<Pickup />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/flow" element={<Flows />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/transaction" element={<CurrentTransactionsTable />} />
              <Route path="/admin" element={<AdminConfig />} />
              <Route path="/organizations" element={<OrganizationManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    );
  };

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
          </>
        ) : (
          <Route path="*" element={<MainLayout />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
