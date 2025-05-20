import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

/**
 * Component Header/Navigation cho trang đặt tiệc
 */
function BookingHeader() {
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
            <Nav.Link as={NavLink} to="/booking" end>
              Trang chủ Đặt tiệc
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/halls">
              Sảnh tiệc
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/new">
              Đặt tiệc
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/lookup">
              Tra cứu tiệc cưới
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/list">
              Quản lý đặt tiệc
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/regulations">
              Quy định
            </Nav.Link>
            <Nav.Link as={NavLink} to="/booking/regulations/manage">
              Quản lý quy định
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookingHeader;
