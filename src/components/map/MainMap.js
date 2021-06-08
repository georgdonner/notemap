import { useEffect, useState } from "react";
import { useFirestore, useUser, useFirestoreCollectionData } from "reactfire";

import Map from "./Map";

const MainMap = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const [markers, setMarkers] = useState([]);
  const [markersFetched, setMarkersFetched] = useState(false);

  const mapCollection = firestore.collection("maps");

  const ownedQuery = mapCollection.where("owner.id", "==", user.uid);
  const { data: ownedMaps } = useFirestoreCollectionData(ownedQuery, {
    idField: "id",
  });
  const sharedQuery = mapCollection.where(
    `members.${user.uid}.name`,
    ">",
    "''"
  );
  const { data: sharedMaps } = useFirestoreCollectionData(sharedQuery, {
    idField: "id",
  });

  useEffect(() => {
    const fetchMarkers = async (map) => {
      const { docs } = await firestore
        .collection(`maps/${map.id}/markers`)
        .get();
      return docs.map((doc) => ({ ...doc.data(), id: doc.id, map }));
    };
    const fetchAllMarkers = async (maps) => {
      const results = await Promise.all(maps.map((map) => fetchMarkers(map)));
      setMarkers(results.flat());
    };
    if (ownedMaps && sharedMaps && !markersFetched) {
      setMarkersFetched(true);
      const maps = ownedMaps.concat(sharedMaps);
      fetchAllMarkers(maps);
    }
  }, [firestore, ownedMaps, sharedMaps, markersFetched]);

  return (
    <>
      <Map
        markers={markers}
        getMarkersRef={(mapID) =>
          firestore.collection("maps/" + mapID + "/markers")
        }
      />
    </>
  );
};

export default MainMap;
