import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import authService, { PERMISSIONS } from '../../../services/authService';

/**
 * Component Header/Navigation cho trang đặt tiệc
 */
function BookingHeader() {
  // Define navigation items with permissions
  const navItems = [
    {
      to: '/booking',
      label: 'Trang chủ Đặt tiệc',
      permission: null, // No permission required
      end: true
    },
    {
      to: '/booking/halls',
      label: 'Sảnh tiệc',
      permission: PERMISSIONS.MANAGE_BOOKINGS | PERMISSIONS.SEARCH_WEDDINGS
    },
    {
      to: '/booking/new',
      label: 'Đặt tiệc',
      permission: PERMISSIONS.MANAGE_BOOKINGS
    },
    {
      to: '/booking/lookup',
      label: 'Tra cứu tiệc cưới',
      permission: PERMISSIONS.SEARCH_WEDDINGS
    },
    {
      to: '/booking/list',
      label: 'Quản lý đặt tiệc',
      permission: PERMISSIONS.MANAGE_BOOKINGS | PERMISSIONS.SEARCH_WEDDINGS
    },
    {
      to: '/booking/regulations',
      label: 'Quy định',
      permission: null // Everyone can view regulations
    },
    {
      to: '/booking/regulations/manage',
      label: 'Quản lý quy định',
      permission: PERMISSIONS.MANAGE_REGULATIONS
    }
  ];

  // Filter navigation items based on permissions
  const visibleNavItems = navItems.filter(item => {
    if (!item.permission) return true; // No permission required
    return authService.hasAnyPermission(item.permission);
  });

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/logo.png" 
            alt="Wedding Management" 
            height="40" 
            className="d-inline-block align-top me-2"
          />
          Quản Lý Tiệc Cưới
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Trở về Trang chủ
            </Nav.Link>
            {visibleNavItems.map((item, index) => (
              <Nav.Link 
                key={index}
                as={NavLink} 
                to={item.to}
                end={item.end}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookingHeader;
