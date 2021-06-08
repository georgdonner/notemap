import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useParams } from "react-router";

import Map from "./Map";

const SingleMap = () => {
  const { id } = useParams();
  const firestore = useFirestore();
  const markersRef = firestore.collection("maps/" + id + "/markers");

  const { data: markers } = useFirestoreCollectionData(markersRef, {
    idField: "id",
    initialData: [],
  });

  return <Map markers={markers} getMarkersRef={() => markersRef} />;
};

export default SingleMap;
