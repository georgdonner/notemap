import { useState, useEffect } from "react";
import { CirclePicker } from "react-color";
import { useHistory, useParams } from "react-router";
import { useFirestore, useUser } from "reactfire";
import { Modal, Button } from "react-bootstrap";

const DEFAULT_MAP = {
  name: "",
  description: "",
  color: "",
};

const DeleteModal = ({ show, onClose, onDelete, map }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Karte löschen</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Möchtest du wirklich die Karte <b>{map.name}</b> und alle ihre Marker
      löschen?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="light" onClick={onClose}>
        Abbrechen
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Löschen
      </Button>
    </Modal.Footer>
  </Modal>
);

const MapForm = () => {
  const history = useHistory();
  const { id } = useParams();

  const firestore = useFirestore();
  const { data: user } = useUser();

  const [map, setMap] = useState(DEFAULT_MAP);
  const [mapDocLoaded, setMapDocLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchMap() {
      const mapDoc = await firestore.collection("maps").doc(id).get();
      setMapDocLoaded(true);

      const mapData = mapDoc?.data();
      if (mapData) {
        setMap({
          ...mapData,
        });
      }
    }
    if (firestore && id && !mapDocLoaded) {
      fetchMap();
    }
  }, [firestore, id, mapDocLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mapCollection = firestore.collection("maps");

    let added;
    if (id) {
      await mapCollection.doc(id).update(map);
    } else {
      added = await mapCollection.add({
        ...map,
        owner: {
          id: user.uid,
          name: user.displayName,
        },
      });
    }

    history.replace(`/map/${id || added.id}`);
  };

  const deleteMap = async () => {
    try {
      await firestore.collection("maps").doc(id).delete();
      history.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container p-4" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4">{id ? "Karte bearbeiten" : "Neue Karte"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={map.name}
            onChange={(e) => setMap({ ...map, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Beschreibung
          </label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={map.description}
            onChange={(e) => setMap({ ...map, description: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Farbe</label>
          <CirclePicker
            color={map.color}
            onChangeComplete={(color) => setMap({ ...map, color: color.hex })}
          />
        </div>
        <Button className="me-3" variant="primary" type="submit">
          Speichern
        </Button>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Löschen
        </Button>
      </form>

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteMap}
        map={map}
      />
    </div>
  );
};

export default MapForm;
