import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const NavbarComp = ({ sidebar, setSidebar }) => {
  function toggleSidebar() {
    console.log(sidebar);
    setSidebar(!sidebar);
  }

  return (
    <div className="d-flex flex-start">
      <Navbar expand="true" style={{ flex: 1 }} className="ms-3">
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => toggleSidebar()}
          style={{ marginRight: "5px" }}
        />
        <Navbar.Brand href="/">Notemap</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/main-map">Hauptkarte</Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
