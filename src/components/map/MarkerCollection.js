import { useEffect } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";

const MarkerCollection = ({ map, renderMarker, singleMap }) => {
  const firestore = useFirestore();
  const leafletMap = useMap();

  const markersRef = firestore.collection(`/maps/${map.id}/markers`);
  const { data } = useFirestoreCollectionData(markersRef, {
    idField: "id",
    initialData: [],
  });

  useEffect(() => {
    let minLat, minLong, maxLat, maxLong;
    for (const marker of data) {
      const { _lat: lat, _long: long } = marker.position;
      if (!minLat || lat < minLat) {
        minLat = lat;
      }
      if (!minLong || long < minLong) {
        minLong = long;
      }
      if (!maxLat || lat > maxLat) {
        maxLat = lat;
      }
      if (!maxLong || long > maxLong) {
        maxLong = long;
      }
    }
    if (minLat && maxLat && minLong && maxLong) {
      let newBounds = new LatLngBounds([maxLat, minLong], [minLat, maxLong]);
      if (!singleMap) {
        const currentBounds = leafletMap.getBounds();
        if (currentBounds) {
          newBounds = currentBounds.extend(newBounds);
        }
      }
      leafletMap.fitBounds(newBounds);
    }
  }, [data, leafletMap, singleMap]);

  const markers = data.map((marker) => ({ ...marker, map }));
  return markers.map((marker) => renderMarker(marker));
};

export default MarkerCollection;
