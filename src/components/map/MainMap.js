import { useFirestore, useUser, useFirestoreCollectionData } from "reactfire";

import Map from "./Map";

const MainMap = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();

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

  let maps = [];
  if (ownedMaps && sharedMaps) {
    maps = ownedMaps.concat(sharedMaps);
  }

  return (
    <>
      <Map
        maps={maps}
        getMarkersRef={(mapID) =>
          firestore.collection("maps/" + mapID + "/markers")
        }
      />
    </>
  );
};

export default MainMap;
