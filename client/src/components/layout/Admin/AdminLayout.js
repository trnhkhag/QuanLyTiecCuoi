import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Divider, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ShopOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService, { PERMISSIONS } from '../../../services/authService';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const allMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      permission: null // No permission required
    },
    {
      key: '/admin/halls',
      icon: <ShopOutlined />,
      label: 'Quản lý Sảnh cưới',
      permission: PERMISSIONS.MANAGE_HALLS
    },
    {
      key: '/admin/regulations',
      icon: <FileTextOutlined />,
      label: 'Quản lý Quy định',
      permission: PERMISSIONS.MANAGE_REGULATIONS
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Quản lý Người dùng',
      permission: PERMISSIONS.MANAGE_USERS
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt Hệ thống',
      permission: PERMISSIONS.MANAGE_REGULATIONS // Admin level permission
    },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => {
    if (!item.permission) return true; // No permission required
    return authService.hasPermission(item.permission);
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={toggleCollapsed}
        theme="light"
        style={{ 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          zIndex: 10
        }}
      >
        <div style={{ 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '8px',
          height: '64px'
        }}>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              Wedding Admin
            </Title>
          )}
          {collapsed && (
            <Avatar style={{ backgroundColor: '#1890ff' }} size="large">
              W
            </Avatar>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          zIndex: 9
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={5} dot>
              <BellOutlined style={{ fontSize: '18px', marginRight: '24px' }} />
            </Badge>
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: '8px' }}>Admin</span>
          </div>
        </Header>
        <Content style={{ 
          margin: '16px', 
          padding: '16px', 
          background: '#fff',
          borderRadius: '4px',
          minHeight: 280,
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;