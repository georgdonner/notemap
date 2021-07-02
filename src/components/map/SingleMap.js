import { useFirestore, useFirestoreDocData } from "reactfire";
import { useParams } from "react-router";

import Map from "./Map";
import Loader from "../common/Loader";

const SingleMap = () => {
  const { id } = useParams();
  const firestore = useFirestore();

  const mapRef = firestore.collection("maps").doc(id);
  const { data: map } = useFirestoreDocData(mapRef, {
    idField: "id",
  });

  const markersRef = firestore.collection("maps/" + id + "/markers");

  return map ? (
    <div>
      <Map singleMap={map} getMarkersRef={() => markersRef} />
    </div>
  ) : (
    <Loader />
  );
};

export default SingleMap;
