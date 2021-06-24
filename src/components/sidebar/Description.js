import React, { useState } from "react";
import { FaCog, FaShareAlt } from "react-icons/all";
import { Link } from "react-router-dom";
import { useUser } from "reactfire";

import ShareModal from "./ShareModal";
import "./Description.css";

const Description = ({ map }) => {
  const { data: user } = useUser();

  const [shareModal, toggleShareModal] = useState(false);

  const isOwner = user?.uid === map.owner.id;

  return !map ? (
    <h2 className="p-3">Hauptkarte</h2>
  ) : (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">{map.name}</h2>
        <div className="d-flex">
          {isOwner ? (
            <div
              className="sidebar-icon me-3"
              onClick={() => toggleShareModal(true)}
            >
              <FaShareAlt />
              <span>Teilen</span>
            </div>
          ) : null}
          <Link to={`/map/${map.id}/edit`} className="sidebar-icon">
            <FaCog />
            <span>Bearbeiten</span>
          </Link>
        </div>
      </div>
      {map.description ? <p className="mt-3 mb-0">{map.description}</p> : null}
      {!isOwner ? (
        <p className="mt-3 mb-0 text-secondary">Geteilt von {map.owner.name}</p>
      ) : null}
      {isOwner ? (
        <ShareModal
          show={shareModal}
          onClose={() => toggleShareModal(false)}
          map={map}
        />
      ) : null}
    </div>
  );
};

export default Description;
