import React from "react";
import SearchForm from "../SearchForm";

const Sidebar = ({ searchIndex, centerOnMarker }) => {
  return (
    <div style={{ width: "400px", height: "100vh", display: "inline-block" }}>
      Test
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>
  );
};

export default Sidebar;
