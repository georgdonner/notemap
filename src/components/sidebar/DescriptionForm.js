import React from "react";
import { FaCog } from "react-icons/all";
import { useHistory } from "react-router-dom";

const DescriptionForm = ({ maps }) => {
  const history = useHistory();
  //console.log(maps[0].members.length);

  function editButton() {
    history.push(maps[0].id + "/edit");
  }

  return maps.length > 1 ? (
    <div style={{ margin: "5px" }}>
      <h2>Hauptkarte</h2>
    </div>
  ) : (
    <div style={{ margin: "5px" }}>
      <h2 className="my-3" style={{ display: "inline-block" }}>
        {maps[0].name}
      </h2>
      <FaCog
        style={{
          display: "inline-block",
          float: "right",
          fontSize: "25px",
          cursor: "pointer",
        }}
        onClick={() => {
          editButton();
        }}
      />
      {maps[0].description ? (
        <p className="mb-3">{maps[0].description}</p>
      ) : null}
      <p>Geteilt mit {maps[0].members.length}</p>
    </div>
  );
};

export default DescriptionForm;
