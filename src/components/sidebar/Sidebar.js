import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";

const Sidebar = ({ searchIndex, centerOnMarker, map, sidebar, setSidebar }) => {
  return (
    <div
      id="sidebar"
      style={{
        height: "100vh",
        width: sidebar ? "400px" : "0px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        overflowY: "scroll",
      }}
      className="d-inline-block"
    >
      <Description map={map} sidebar={sidebar} setSidebar={setSidebar} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>

    /*<Nav
      style={{
        width: sidebar ? "400px" : "0px",
        height: "100vh",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        overflowY: "scroll",
      }}
      className="col-md-12 d-none d-md-block bg-light sidebar d-inline-block"
    >
      <Description map={map} sidebar={sidebar} setSidebar={setSidebar} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </Nav>*/
  );
};

export default Sidebar;
