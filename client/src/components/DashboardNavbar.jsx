import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const DashboardNavbar = () => {
  const location = useLocation();
  
  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <h1>QLTC</h1>
      </div>
      
      <ul className="nav-links">
        <li className={isActive('/dashboard') ? 'active' : ''}>
          <Link to="/dashboard">
            <i className="fas fa-home"></i>
            <span>Tổng quan</span>
          </Link>
        </li>
        <li className={isActive('/invoices') ? 'active' : ''}>
          <Link to="/invoices">
            <i className="fas fa-file-invoice-dollar"></i>
            <span>Hóa đơn</span>
          </Link>
        </li>

        <li className={isActive('/reports/monthly') ? 'active' : ''}>
          <Link to="/reports/monthly">
            <i className="fas fa-chart-bar"></i>
            <span>Báo cáo tháng</span>
          </Link>
        </li>
        {/* Add more menu items here */}
      </ul>
      
      <div className="nav-footer">
        <Link to="/profile" className="nav-profile">
          <i className="fas fa-user-circle"></i>
          <span>Tài khoản</span>
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 