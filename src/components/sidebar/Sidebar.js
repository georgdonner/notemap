import React from "react";
import SearchForm from "../SearchForm";
import DescriptionForm from "./DescriptionForm";

const Sidebar = ({ searchIndex, centerOnMarker, maps }) => {
  return (
    <div style={{ width: "400px", height: "100vh", display: "inline-block" }}>
      <DescriptionForm maps={maps} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>
  );
};

export default Sidebar;
