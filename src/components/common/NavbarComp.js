import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavbarComp = ({ sidebar, setSidebar }) => {
  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  return (
    <div className="d-flex flex-start">
      <Navbar
        expand="true"
        style={{ flex: 1, borderBottom: "1px #f2f2f2 solid" }}
        className="ps-3"
      >
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => toggleSidebar()}
          className="border-0 px-0 ms-0 me-4"
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
