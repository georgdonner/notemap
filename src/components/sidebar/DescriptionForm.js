import React from "react";

const DescriptionForm = ({ maps }) => {
  return maps.length > 1 ? (
    <div style={{ margin: "5px" }}>
      <h2>Hauptkarte</h2>
    </div>
  ) : (
    <div style={{ margin: "5px" }}>
      <h2 className="my-3">{maps[0].name}</h2>
      {maps[0].description ? (
        <p className="mb-3">{maps[0].description}</p>
      ) : null}
    </div>
  );
};

export default DescriptionForm;
