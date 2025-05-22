import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faCalendarAlt,
  faFileInvoiceDollar,
  faChartBar,
  faCog,
  faUserCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';

const DashboardNavbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: <FontAwesomeIcon icon={faHome} />,
      label: 'Tổng quan'
    },
    {
      path: '/booking',
      icon: <FontAwesomeIcon icon={faCalendarAlt} />,
      label: 'Đặt tiệc'
    },
    {
      path: '/invoices',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
      label: 'Hóa đơn'
    },
    {
      path: '/reports',
      icon: <FontAwesomeIcon icon={faChartBar} />,
      label: 'Báo cáo'
    },
    {
      path: '/admin',
      icon: <FontAwesomeIcon icon={faCog} />,
      label: 'Quản trị'
    }
  ];

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <h1>QLTC</h1>
      </div>
      
      <ul className="nav-links">
        {menuItems.map((item) => (
          <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
            <Link to={item.path}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="nav-footer">
        <Link to="/profile" className="nav-profile">
          <span className="nav-icon"><FontAwesomeIcon icon={faUserCircle} /></span>
          <span className="nav-label">Tài khoản</span>
        </Link>
        <Link to="/logout" className="nav-logout">
          <span className="nav-icon"><FontAwesomeIcon icon={faSignOutAlt} /></span>
          <span className="nav-label">Đăng xuất</span>
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 