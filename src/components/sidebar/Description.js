import React, { useContext, useState } from "react";
import { FaCog, FaShareAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useFunctions } from "reactfire";

import ShareModal from "./ShareModal";
import useOnline from "../../hooks/useOnline";
import AuthContext from "../../context/auth";
import "./Description.css";

const Description = ({ map }) => {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const functions = useFunctions();
  const online = useOnline();

  const [shareModal, toggleShareModal] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(false);

  const isOwner = user?.uid === map?.owner.id;

  async function leaveMap() {
    try {
      setLoadingLeave(true);
      await functions.httpsCallable("leaveMap")({
        map: map.id,
      });
      history.replace("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLeave(false);
    }
  }

  return !map ? (
    <>
      <h2 className="p-3">Hauptkarte</h2>
      <p className="px-3">Hier findest du alle Markierungen deiner Karten</p>
    </>
  ) : (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">{map.name}</h2>
        {online ? (
          <div className="d-flex">
            {isOwner ? (
              <>
                <div
                  className="sidebar-icon me-3"
                  onClick={() => toggleShareModal(true)}
                >
                  <FaShareAlt />
                  <span>Teilen</span>
                </div>
                <Link to={`/map/${map.id}/edit`} className="sidebar-icon">
                  <FaCog />
                  <span>Bearbeiten</span>
                </Link>
              </>
            ) : (
              <div className="sidebar-icon" onClick={leaveMap}>
                {loadingLeave ? (
                  <div className="spinner-border button-loading" role="status">
                    <span className="visually-hidden">Lädt...</span>
                  </div>
                ) : (
                  <FaSignOutAlt />
                )}
                <span>Karte verlassen</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
      {map.description ? <p className="mt-3 mb-0">{map.description}</p> : null}
      {!isOwner ? (
        <p className="mt-3 mb-0 text-secondary">Geteilt von {map.owner.name}</p>
      ) : null}
      {isOwner && online ? (
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
