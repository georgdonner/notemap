import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Sidebar = ({ searchIndex, centerOnMarker, map, sidebar, setSidebar }) => {
  const mobileView = useMediaQuery("(max-width:567px)");

  return (
    <div
      style={{
        height: "calc(100vh - 56px)",
        width: "400px",
        boxShadow: "0 20px 20px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
      }}
      className={sidebar ? "d-flex flex-column" : "d-none"}
    >
      <div>{sidebar}</div>
      <Description map={map} />
      <SearchForm
        searchIndex={searchIndex}
        centerOnMarker={() => {
          centerOnMarker();
          if (mobileView) {
            setSidebar();
          }
        }}
      />
    </div>
  );
};

export default Sidebar;
