import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import DashboardNavbar from './DashboardNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      <div className="main-content">
        <Container fluid className="dashboard-content">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout; 