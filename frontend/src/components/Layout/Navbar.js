// frontend/src/components/Layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}>
          🎬 Movie Recommender
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/admin/movies">Movies</Nav.Link>
                    <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/user/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/user/recommendations">Recommendations</Nav.Link>
                    <Nav.Link as={Link} to="/user/movies">Browse Movies</Nav.Link>
                    <Nav.Link as={Link} to="/user/history">My History</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/change-password">Change Password</Nav.Link>
                <Nav.Item className="d-flex align-items-center ms-2">
                  <span className="text-light me-3">
                    {user.name} ({user.role})
                  </span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;