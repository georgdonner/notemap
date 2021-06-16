import { useFirestore, useFirestoreDocData } from "reactfire";
import { useParams } from "react-router";

import Map from "./Map";

const SingleMap = () => {
  const { id } = useParams();
  const firestore = useFirestore();

  const mapRef = firestore.collection("maps").doc(id);
  const { data: map } = useFirestoreDocData(mapRef, {
    idField: "id",
  });

  const markersRef = firestore.collection("maps/" + id + "/markers");

  return map ? (
    <div style={{ margin: "0 1.5rem" }}>
      <h2 className="my-3">{map.name}</h2>
      {map.description ? <p className="mb-3">{map.description}</p> : null}
      <Map maps={map ? [map] : []} getMarkersRef={() => markersRef} />
    </div>
  ) : (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SingleMap;
