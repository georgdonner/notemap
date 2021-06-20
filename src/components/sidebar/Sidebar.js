import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";

const Sidebar = ({ searchIndex, centerOnMarker, map }) => {
  return (
    <div
      style={{
        width: "400px",
        height: "100vh",
        overflowY: "scroll",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        position: "relative",
      }}
      className="d-inline-block p-3"
    >
      <Description map={map} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>
  );
};

export default Sidebar;
