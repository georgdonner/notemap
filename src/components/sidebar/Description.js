import React, { useState } from "react";
import { FaCog, FaUserPlus, FaPlus, FaTimes } from "react-icons/all";
import { useHistory } from "react-router-dom";

import SharedWith from "../common/SharedWith";

const Description = ({ map }) => {
  const history = useHistory();
  const members = map ? Object.values(map.members || {}) : [];

  const [addUser, setAddUser] = useState(false);
  const [addUserInputValue, setAddUserInputValue] = useState("");

  function editButton() {
    history.push(map.id + "/edit");
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

  return !map ? (
    <h2
      style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}
      className="p-3"
    >
      Hauptkarte
    </h2>
  ) : (
    <div
      style={{ position: "sticky", top: 0, zIndex: 10, background: "white" }}
      className="p-3"
    >
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2 className="mb-0">{map.name}</h2>
        <FaCog
          style={{
            fontSize: "25px",
            cursor: "pointer",
          }}
          onClick={editButton}
        />
      </div>
      {map.description ? <p className="mb-3">{map.description}</p> : null}
      <div>
        <SharedWith
          members={members}
          emptyState="Mit niemand geteilt"
          className="d-inline-block m-0"
        />
        <FaUserPlus
          style={{ marginLeft: "10px", marginBottom: "5px", cursor: "pointer" }}
          onClick={toggleAddUser}
        />
      </div>
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

export default Description;
