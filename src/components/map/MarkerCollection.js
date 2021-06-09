import { useFirestore, useFirestoreCollectionData } from "reactfire";

const MarkerCollection = ({ map, renderMarker }) => {
  const firestore = useFirestore();

  const markersRef = firestore.collection(`/maps/${map.id}/markers`);
  const { data } = useFirestoreCollectionData(markersRef, {
    idField: "id",
    initialData: [],
  });

  const markers = data.map((marker) => ({ ...marker, map }));
  return markers.map((marker) => renderMarker(marker));
};

export default MarkerCollection;
