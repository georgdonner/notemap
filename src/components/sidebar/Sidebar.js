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
  );
};

export default Sidebar;
