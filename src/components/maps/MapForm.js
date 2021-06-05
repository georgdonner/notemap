import { useState, useEffect } from "react";
import { CirclePicker } from "react-color";
import { useHistory, useParams } from "react-router";
import { useFirestore, useUser } from "reactfire";

const DEFAULT_MAP = {
  name: "",
  description: "",
  color: "",
};

const MapForm = () => {
  const history = useHistory();
  const { id } = useParams();

  const firestore = useFirestore();
  const { data: user } = useUser();

  const [map, setMap] = useState(DEFAULT_MAP);
  const [mapDocLoaded, setMapDocLoaded] = useState(false);

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

  return (
    <div className="container p-4" style={{ maxWidth: "1000px" }}>
      <h2 className="mb-4">Neue Karte</h2>
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
            Description
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
          <label className="form-label">Color</label>
          <CirclePicker
            color={map.color}
            onChangeComplete={(color) => setMap({ ...map, color: color.hex })}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default MapForm;
