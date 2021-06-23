import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";
import { Offcanvas } from "react-bootstrap";

const Sidebar = ({ searchIndex, centerOnMarker, map, sidebar, setSidebar }) => {
  function handleClose() {
    setSidebar(false);
  }

  return (
    <div>
      <Offcanvas
        style={{
          width: "400px",
          height: "100vh",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
          overflowY: "scroll",
        }}
        show={sidebar}
        onHide={handleClose}
        scroll={true}
        backdropClassName={false}
      >
        <Description map={map} sidebar={sidebar} setSidebar={setSidebar} />
        <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
      </Offcanvas>
    </div>

    /*<Nav
      style={{
        width: "400px",
        height: "100vh",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        overflowY: "scroll",
      }}
      className="col-md-12 d-none d-md-block bg-light sidebar d-inline-block"
    >
      <Description map={map} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </Nav>*/

    /*<div
      id="sidebar"
      style={{
        height: "100vh",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        overflowY: "scroll",
        flex: 1,
      }}
      className="d-inline-block"
    >
      <Description map={map} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>*/
  );
};

export default Sidebar;
