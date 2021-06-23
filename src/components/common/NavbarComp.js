import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const NavbarComp = ({ sidebar, setSidebar }) => {
  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <div className="justify-content-start">
      <Navbar bg="light" expand="xxxl">
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
