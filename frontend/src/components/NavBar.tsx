import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";

export const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="md" className="d-print-none">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          Napravi Uplatnicu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/history">
              Istorija uplatnica
            </Nav.Link>
            <Nav.Link as={NavLink} to="/receivers">
              Primaoci plaćanja
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              Moj profil
            </Nav.Link>
          </Nav>
          <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
            Odjava
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
