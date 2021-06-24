import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const NavbarComp = ({ sidebar, setSidebar }) => {
  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <div className="d-flex flex-start">
      <Navbar bg="light" expand="true" style={{ flex: 1 }}>
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => toggleSidebar()}
            style={{ marginRight: "5px" }}
          />
          <Navbar.Brand href="/">Notemap</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/main-map">Hauptkarte</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
