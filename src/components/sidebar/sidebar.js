import React from "react";
import SearchForm from "../searchForm";

const sidebar = ({ searchIndex }) => {
  return (
    <div style={{ width: "400px", height: "100vh", float: "left" }}>
      Test
      <SearchForm searchIndex={searchIndex} />
    </div>
  );
};

export default sidebar;
