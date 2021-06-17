import React from "react";
import SearchForm from "../SearchForm";

const Sidebar = ({ searchIndex }) => {
  return (
    <div style={{ width: "400px", height: "100vh", display: "inline-block" }}>
      Test
      <SearchForm searchIndex={searchIndex} />
    </div>
  );
};

export default Sidebar;
