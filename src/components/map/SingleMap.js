import { useFirestore, useFirestoreDocData } from "reactfire";
import { useParams } from "react-router";

import Map from "./Map";

const SingleMap = ({ sidebar, setSidebar }) => {
  const { id } = useParams();
  const firestore = useFirestore();

  const mapRef = firestore.collection("maps").doc(id);
  const { data: map } = useFirestoreDocData(mapRef, {
    idField: "id",
  });

  const markersRef = firestore.collection("maps/" + id + "/markers");

  return map ? (
    <div>
      <Map
        singleMap={map}
        getMarkersRef={() => markersRef}
        sidebar={sidebar}
        setSidebar={setSidebar}
      />
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
