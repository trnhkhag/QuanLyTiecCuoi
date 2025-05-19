import React from 'react';
import { Tabs } from 'antd';
import HallList from '../components/HallList';
import HallTypeList from '../components/HallTypeList';

const HallManagementPage = () => {
  const items = [
    {
      key: 'halls',
      label: 'Quản lý sảnh',
      children: <HallList />,
    },
    {
      key: 'hall-types',
      label: 'Quản lý loại sảnh',
      children: <HallTypeList />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý sảnh cưới</h1>
      <Tabs defaultActiveKey="halls" items={items} />
    </div>
  );
};

export default HallManagementPage;