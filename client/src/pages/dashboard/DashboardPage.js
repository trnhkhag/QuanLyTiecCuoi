import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faCalendarAlt,
  faFileInvoiceDollar,
  faChartBar,
  faCog,
  faUserCircle,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faCheck,
  faTimes,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import authService, { PERMISSIONS } from '../../services/authService';
import './DashboardPage.css';

const DashboardPage = () => {
  const [apiStatus, setApiStatus] = useState('Loading...');
  
  useEffect(() => {
    // Test API connection (remove debug console.log)
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/test`)
      .then(response => response.json())
      .then(data => setApiStatus(data.message))
      .catch(error => {
        console.error('API connection error:', error);
        setApiStatus('API connection failed');
      });
  }, []);

  const user = authService.getCurrentUser();
  const permissions = authService.getCurrentUserPermissions();

  // Define route permissions mapping
  const routePermissions = [
    {
      path: '/dashboard',
      name: 'Tổng quan',
      icon: faHome,
      description: 'Trang chủ hệ thống',
      requiredPermission: null,
      color: 'success'
    },
    {
      path: '/booking',
      name: 'Đặt tiệc',
      icon: faCalendarAlt,
      description: 'Quản lý đặt tiệc và tra cứu',
      requiredPermission: PERMISSIONS.MANAGE_BOOKINGS | PERMISSIONS.SEARCH_WEDDINGS,
      color: 'primary'
    },
    {
      path: '/invoices',
      name: 'Hóa đơn',
      icon: faFileInvoiceDollar,
      description: 'Quản lý hóa đơn thanh toán',
      requiredPermission: PERMISSIONS.MANAGE_INVOICES,
      color: 'warning'
    },
    {
      path: '/reports',
      name: 'Báo cáo',
      icon: faChartBar,
      description: 'Xem báo cáo doanh thu',
      requiredPermission: PERMISSIONS.VIEW_REPORTS,
      color: 'info'
    },
    {
      path: '/admin',
      name: 'Quản trị',
      icon: faCog,
      description: 'Quản lý hệ thống',
      requiredPermission: PERMISSIONS.MANAGE_HALLS | PERMISSIONS.MANAGE_REGULATIONS | PERMISSIONS.MANAGE_USERS,
      color: 'danger'
    },
    {
      path: '/profile',
      name: 'Tài khoản',
      icon: faUserCircle,
      description: 'Thông tin cá nhân',
      requiredPermission: PERMISSIONS.VIEW_PROFILE,
      color: 'secondary'
    }
  ];

  // Check access for each route
  const routeAccess = routePermissions.map(route => ({
    ...route,
    hasAccess: route.requiredPermission === null ? true : authService.hasAnyPermission(route.requiredPermission)
  }));

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="hero-title">
                <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                Chào mừng đến với QLTC
              </h1>
              <p className="hero-subtitle">Hệ thống quản lý tiệc cưới chuyên nghiệp</p>
              <p className="hero-description">
                Xin chào <strong>{user?.user?.name || user?.user?.email}</strong>! 
                Bạn đang truy cập với vai trò <span className="role-badge">{user?.user?.role}</span>
              </p>
            </div>
            <div className="col-md-4">
              <div className="status-card">
                <h5>Trạng thái hệ thống</h5>
                <p className={`status ${apiStatus.includes('failed') ? 'offline' : 'online'}`}>
                  {apiStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content">
        <div className="row">
          {/* Access Permissions */}
          <div className="col-lg-8">
            <div className="permissions-card">
              <div className="card-header">
                <h4>
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Quyền truy cập của bạn
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {routeAccess.map((route, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                      <div className={`access-item ${route.hasAccess ? 'granted' : 'denied'}`}>
                        <div className="access-icon">
                          <FontAwesomeIcon icon={route.icon} />
                        </div>
                        <div className="access-info">
                          <h6>{route.name}</h6>
                          <p>{route.description}</p>
                          <div className="access-status">
                            <FontAwesomeIcon 
                              icon={route.hasAccess ? faCheck : faTimes} 
                              className={route.hasAccess ? 'text-success' : 'text-danger'}
                            />
                            <span className={route.hasAccess ? 'text-success' : 'text-danger'}>
                              {route.hasAccess ? 'Có quyền truy cập' : 'Không có quyền'}
                            </span>
                          </div>
                          {route.hasAccess && (
                            <Link to={route.path} className="btn btn-pink btn-sm mt-2">
                              Truy cập ngay
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="contact-card">
              <div className="card-header">
                <h4>
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Thông tin liên hệ
                </h4>
              </div>
              <div className="card-body">
                <div className="contact-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                  <div>
                    <strong>Địa chỉ:</strong>
                    <p>123 Đường Hạnh Phúc, Quận Tình Yêu<br />TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                  <div>
                    <strong>Điện thoại:</strong>
                    <p>+84 123 456 789<br />+84 987 654 321</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                  <div>
                    <strong>Email:</strong>
                    <p>info@qltc.com<br />support@qltc.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <FontAwesomeIcon icon={faGlobe} className="contact-icon" />
                  <div>
                    <strong>Website:</strong>
                    <p>www.qltc.com</p>
                  </div>
                </div>

                <div className="business-hours">
                  <h6>Giờ làm việc:</h6>
                  <p>
                    <strong>Thứ 2 - Thứ 6:</strong> 8:00 - 18:00<br />
                    <strong>Thứ 7:</strong> 8:00 - 17:00<br />
                    <strong>Chủ nhật:</strong> 9:00 - 16:00
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-card mt-4">
              <div className="card-header">
                <h5>Thống kê nhanh</h5>
              </div>
              <div className="card-body">
                <div className="stat-item">
                  <span className="stat-number">{permissions}</span>
                  <span className="stat-label">Tổng quyền</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{routeAccess.filter(r => r.hasAccess).length}</span>
                  <span className="stat-label">Module truy cập</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{user?.user?.role?.toUpperCase()}</span>
                  <span className="stat-label">Vai trò</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 