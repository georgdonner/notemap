import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useFunctions } from "reactfire";

const ShareModal = ({ show, onClose, map }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loadingAdd, setLoadingAdd] = useState();
  const [members, setMembers] = useState(map.members || {});

  const functions = useFunctions();

  const membersArray = Object.entries(members).map(([id, member]) => ({
    id,
    ...member,
  }));

  useEffect(() => {
    setMembers(map.members);
  }, [map.members]);

  async function addMember() {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailRegex.test(email)) {
      try {
        setLoadingAdd(true);
        await functions.httpsCallable("addMember")({
          email,
          map: map.id,
        });
        setEmail("");
      } catch (error) {
        setEmailError(error.message);
      } finally {
        setLoadingAdd(false);
      }
    } else {
      setEmailError("Ungültige E-Mail-Adresse");
    }
  }

  async function removeMember(userId) {
    try {
      setMembers({
        ...members,
        [userId]: {
          ...members[userId],
          loadingRemove: true,
        },
      });
      await functions.httpsCallable("removeMember")({
        userId,
        map: map.id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Karte teilen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label htmlFor="name" className="form-label">
            Freund:in hinzufügen
          </label>
          <div className="input-group mb-3">
            <input
              type="email"
              className={`form-control${emailError ? " is-invalid" : ""}`}
              placeholder="E-Mail eingeben"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addMember();
                }
              }}
              onFocus={() => setEmailError("")}
              aria-describedby="emailFeedback"
              required
            />
            <Button
              variant="primary"
              disabled={loadingAdd}
              onClick={!loadingAdd ? addMember : null}
            >
              Hinzufügen
              {loadingAdd ? (
                <div
                  className="spinner-border text-light button-loading"
                  role="status"
                >
                  <span className="visually-hidden">Lädt...</span>
                </div>
              ) : null}
            </Button>
            <div id="emailFeedback" className="invalid-feedback">
              {emailError}
            </div>
          </div>
        </div>
        {membersArray.length ? (
          <div>
            <p className="mb-3 fw-bold">Geteilt mit</p>
            {membersArray.map((member) => (
              <div
                key={member.id}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>{member.name}</span>
                <Button
                  variant="danger"
                  disabled={member.loadingRemove}
                  onClick={
                    !member.loadingRemove ? () => removeMember(member.id) : null
                  }
                >
                  Entfernen
                  {member.loadingRemove ? (
                    <div
                      className="spinner-border text-light button-loading"
                      role="status"
                    >
                      <span className="visually-hidden">Lädt...</span>
                    </div>
                  ) : null}
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Schließen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
