import { useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";

const MarkerCollection = ({ map, renderMarker, singleMap, searchIndex }) => {
  const firestore = useFirestore();
  const leafletMap = useMap();
  const [mapCentered, setMapCentered] = useState(false);

  const markersRef = firestore.collection(`/maps/${map.id}/markers`);
  const { data } = useFirestoreCollectionData(markersRef, {
    idField: "id",
    initialData: [],
  });

  useEffect(() => {
    const allData = new Set(Object.keys(searchIndex.store));

    for (const marker of data) {
      allData.delete(marker.id);
      searchIndex.add(marker);
    }

    allData.forEach((markerId) => {
      searchIndex.remove(markerId);
    });
  }, [data, searchIndex]);

  useEffect(() => {
    if (!mapCentered) {
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
        setMapCentered(true);
        leafletMap.fitBounds(newBounds);
      }
    }
  }, [data, leafletMap, singleMap, mapCentered]);

  const markers = data.map((marker) => ({ ...marker, map }));
  return markers.map((marker) => renderMarker(marker));
};

export default MarkerCollection;
