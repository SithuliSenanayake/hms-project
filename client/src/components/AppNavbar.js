import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">HMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/patients" active={location.pathname === '/patients'}>
              Patients
            </Nav.Link>
            <Nav.Link as={Link} to="/appointments" active={location.pathname === '/appointments'}>
              Appointments
            </Nav.Link>
            <Nav.Link as={Link} to="/billing" active={location.pathname === '/billing'}>
              Billing
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            <span className="text-light me-3">
              {user?.name} ({user?.role})
            </span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;