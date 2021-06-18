import React, { useState } from "react";
import { FaCog, FaUserPlus, FaPlus, FaTimes } from "react-icons/all";
import { useHistory } from "react-router-dom";

const DescriptionForm = ({ maps }) => {
  const history = useHistory();
  const members = Object.values(maps[0].members);

  const [addUser, setAddUser] = useState(false);
  const [addUserInputValue, setAddUserInputValue] = useState("");

  function editButton() {
    history.push(maps[0].id + "/edit");
  }

  function toggleAddUser() {
    setAddUser(!addUser);
    setAddUserInputValue("");
  }

  function addUserInputChange(e) {
    setAddUserInputValue(e.target.value);
  }

  function handleAddUser() {
    console.log("Add user with E-Mail: ", addUserInputValue);
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
      <div style={{ display: "inline-block" }}>
        {maps[0].description ? (
          <p className="mb-3">{maps[0].description}</p>
        ) : null}
        {members.length === 0 ? (
          <p>Mit noch keinem:keiner Freund:Freundin geteilt</p>
        ) : null}
        {members.length === 1 ? (
          <p>Mit einem:einer Freund:Freundin geteilt</p>
        ) : null}
        {members.length > 1 ? (
          <p>Mit {members.length} Freund:innen geteilt</p>
        ) : null}
      </div>
      <FaUserPlus
        style={{ marginLeft: "10px", marginBottom: "5px", cursor: "pointer" }}
        onClick={() => {
          toggleAddUser();
        }}
      />
      {addUser ? (
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="E-Mail eingeben"
            aria-label="addUserInput"
            aria-describedby="addUserInput"
            value={addUserInputValue}
            onChange={addUserInputChange}
          />
          <span className="input-group-text" id="basic-addon2">
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleAddUser();
              }}
            />
          </span>
          <span className="input-group-text" id="basic-addon2">
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => {
                toggleAddUser();
              }}
            />
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default DescriptionForm;
