import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import authService, { PERMISSIONS } from '../services/authService';
import '../styles/navbar.css';

const DashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Helper function to check admin permissions
  const hasAnyAdminPermission = () => {
    return authService.hasAnyPermission(
      PERMISSIONS.MANAGE_HALLS | 
      PERMISSIONS.MANAGE_REGULATIONS | 
      PERMISSIONS.MANAGE_USERS
    );
  };

  // Define menu items with required permissions
  const menuItems = [
    {
      path: '/dashboard',
      icon: <FontAwesomeIcon icon={faHome} />,
      label: 'Tổng quan',
      permission: null // No permission required
    },
    {
      path: '/booking',
      icon: <FontAwesomeIcon icon={faCalendarAlt} />,
      label: 'Đặt tiệc',
      permission: PERMISSIONS.MANAGE_BOOKINGS | PERMISSIONS.SEARCH_WEDDINGS
    },
    {
      path: '/invoices',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
      label: 'Hóa đơn',
      permission: PERMISSIONS.MANAGE_INVOICES
    },
    {
      path: '/reports',
      icon: <FontAwesomeIcon icon={faChartBar} />,
      label: 'Báo cáo',
      permission: PERMISSIONS.VIEW_REPORTS
    },
    {
      path: '/admin',
      icon: <FontAwesomeIcon icon={faCog} />,
      label: 'Quản trị',
      permission: 'admin_check' // Special case - check any admin permission
    }
  ];

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.permission) return true; // No permission required
    if (item.permission === 'admin_check') {
      return hasAnyAdminPermission(); // Check any admin permission
    }
    // Check if user has ANY of the required permissions using authService
    return authService.hasAnyPermission(item.permission);
  });

  return (
    <nav className="dashboard-nav">
      <div className="nav-logo">
        <h1>QLTC</h1>
      </div>
      
      <ul className="nav-links">
        {visibleMenuItems.map((item) => (
          <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
            <Link to={item.path}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="nav-footer">
        {authService.hasPermission(PERMISSIONS.VIEW_PROFILE) && (
        <Link to="/profile" className="nav-profile">
          <span className="nav-icon"><FontAwesomeIcon icon={faUserCircle} /></span>
          <span className="nav-label">Tài khoản</span>
        </Link>
        )}
        <button onClick={handleLogout} className="nav-logout">
          <span className="nav-icon"><FontAwesomeIcon icon={faSignOutAlt} /></span>
          <span className="nav-label">Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 