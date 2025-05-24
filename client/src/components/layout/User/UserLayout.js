import React from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  ShopOutlined,
  CalendarOutlined,
  SearchOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const UserLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/booking',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/booking/halls',
      icon: <ShopOutlined />,
      label: 'Sảnh tiệc',
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header style={{ 
        zIndex: 1, 
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}>
          <h1 style={{ 
            margin: '0 24px 0 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            <Link to="/booking" style={{ color: 'inherit' }}>
              Tiệc Cưới Hoàng Gia
            </Link>
          </h1>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            lineHeight: '64px', 
            border: 'none',
            flex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}
        />
          
        <div>
          <Button 
            type="primary" 
            icon={<CalendarOutlined />}
            onClick={() => navigate('/booking/new')}
            style={{ marginRight: 16 }}
          >
            Đặt Tiệc
          </Button>
          <Avatar icon={<UserOutlined />} />
        </div>
      </Header>

      <Content style={{ 
        padding: '24px 50px', 
        marginTop: 64,
        minHeight: 'calc(100vh - 64px - 70px)'
      }}>
        <div style={{ 
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          {children}
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        background: '#f0f2f5',
        padding: '20px 50px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3>Về chúng tôi</h3>
              <p>Tiệc Cưới Hoàng Gia - Nơi những giấc mơ thành hiện thực</p>
            </div>
            <div>
              <h3>Liên hệ</h3>
              <p>Địa chỉ: 123 Đường ABC, Quận XYZ</p>
              <p>Điện thoại: (028) 1234 5678</p>
              <p>Email: info@tieccuoihoanggia.com</p>
            </div>
            <div>
              <h3>Theo dõi chúng tôi</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {/* Thêm các icon mạng xã hội sau */}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
            © {new Date().getFullYear()} Tiệc Cưới Hoàng Gia. All rights reserved.
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default UserLayout;