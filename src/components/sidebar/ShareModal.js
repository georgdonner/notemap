import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ShareModal = ({ show, onClose, map }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const members = Object.entries(map.members || {}).map(([id, member]) => ({
    id,
    ...member,
  }));

  function addMember() {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailRegex.test(email)) {
      console.log(email);
    } else {
      setEmailError("Ungültige E-Mail-Adresse");
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
            <Button variant="primary" onClick={addMember}>
              Hinzufügen
            </Button>
            <div id="emailFeedback" className="invalid-feedback">
              {emailError}
            </div>
          </div>
        </div>
        <div>
          <p className="mb-3 fw-bold">Geteilt mit</p>
          {members?.length
            ? members.map((member) => (
                <div
                  key={member.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>{member.name}</span>
                  <Button variant="danger">Entfernen</Button>
                </div>
              ))
            : null}
        </div>
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
