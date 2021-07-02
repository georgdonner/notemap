import React, { useContext } from "react";
import { Button, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "reactfire";
import { FaSignOutAlt } from "react-icons/all";

import SidebarContext from "../../context/sidebar";

const NavbarComp = () => {
  const auth = useAuth();
  const { sidebar, setSidebar } = useContext(SidebarContext);

  function toggleSidebar() {
    setSidebar(!sidebar);
  }

  function logout() {
    auth.signOut();
  }

  return (
    <div className="d-flex flex-start">
      <Navbar
        expand="true"
        style={{ flex: 1, borderBottom: "1px #f2f2f2 solid" }}
        className="ps-3"
      >
        <div className="d-flex">
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => toggleSidebar()}
            className="border-0 px-0 ms-0 me-4"
          />
          <Navbar.Brand href="/">Notemap</Navbar.Brand>
          <Nav>
            <Nav.Link href="/main-map">Hauptkarte</Nav.Link>
          </Nav>
        </div>
        <Nav className="me-4">
          <Nav.Item>
            <Button
              className="d-flex align-items-center"
              variant="light"
              onClick={logout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
