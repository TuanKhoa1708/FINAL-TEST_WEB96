import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { TeamOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: '/teachers',
    icon: <TeamOutlined />,
    label: 'Teachers',
  },
  {
    key: '/teacher-positions',
    icon: <ApartmentOutlined />,
    label: 'Teacher Positions',
  },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={220}
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <TeamOutlined style={{ fontSize: 22, color: '#1677ff' }} />
          {!collapsed && (
            <span
              style={{
                marginLeft: 10,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                whiteSpace: 'nowrap',
              }}
            >
              Teacher MS
            </span>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#262626' }}>
            {menuItems.find((m) => m.key === location.pathname)?.label ?? 'Teacher Management'}
          </Title>
        </Header>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
