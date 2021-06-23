import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const NavbarComp = ({ sidebar, setSidebar }) => {
  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Notemap</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/main-map">Hauptkarte</Nav.Link>
          </Nav>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => toggleSidebar()}
          />
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
