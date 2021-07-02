import React, { useEffect, useContext } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SidebarContext from "../../context/sidebar";
import SearchForm from "./SearchForm";
import Description from "./Description";

const Sidebar = ({ searchIndex, centerOnMarker, map }) => {
  const mobileView = useMediaQuery("(max-width:567px)");
  const { sidebar, setSidebar } = useContext(SidebarContext);

  useEffect(() => {
    // Sidebar is open by default on Desktop and closed on Mobile
    setSidebar(!mobileView);
  }, [mobileView, setSidebar]);

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
        centerOnMarker={(object) => {
          centerOnMarker(object);
          if (mobileView) {
            setSidebar(false);
          }
        }}
      />
    </div>
  );
};

export default Sidebar;
