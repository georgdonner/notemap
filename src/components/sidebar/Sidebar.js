import React from "react";
import SearchForm from "./SearchForm";
import Description from "./Description";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Sidebar = ({ searchIndex, centerOnMarker, map, sidebar, setSidebar }) => {
  const mobileView = useMediaQuery("(max-width:567px)");
  /*useEffect(() => {
    if (mobileView && sidebar) {
      setSidebar(!sidebar);
    }
  }, [mobileView]);*/
  return (
    <div
      style={{
        height: "100vh",
        width: "400px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
      }}
      className={
        mobileView
          ? sidebar
            ? "flex-column"
            : "d-none"
          : sidebar
          ? "d-none d-sm-flex flex-column"
          : "d-none"
      }
      //className={sidebar ? "d-none d-sm-flex flex-column" : "d-none"}
    >
      <Description map={map} />
      <SearchForm searchIndex={searchIndex} centerOnMarker={centerOnMarker} />
    </div>
  );
};

export default Sidebar;
