import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          Hệ Thống Quản Lý Tiệc Cưới
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={isActive('/dashboard')}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/booking" 
              className={isActive('/booking')}
            >
              Đặt Tiệc
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/invoices" 
              className={isActive('/invoices')}
            >
              Hóa Đơn
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/reports" 
              className={isActive('/reports/monthly')}
            >
              Báo Cáo
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className={isActive('/admin')}
            >
              Quản Trị
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/profile">
              Tài Khoản
            </Nav.Link>
            <Nav.Link as={Link} to="/logout">
              Đăng Xuất
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 