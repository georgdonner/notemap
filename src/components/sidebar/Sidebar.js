import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";

const Sidebar = ({ searchIndex, centerOnMarker, map }) => {
  return (
    <div
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
    </div>
  );
};

export default Sidebar;
