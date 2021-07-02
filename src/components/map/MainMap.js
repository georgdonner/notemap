import { useContext } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

import Map from "./Map";
import Loader from "../common/Loader";
import AuthContext from "../../context/auth";

const MainMap = () => {
  const firestore = useFirestore();
  const { user } = useContext(AuthContext);

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

  return maps.length ? (
    <>
      <Map
        maps={maps}
        getMarkersRef={(mapID) =>
          firestore.collection("maps/" + mapID + "/markers")
        }
      />
    </>
  ) : (
    <Loader />
  );
};

export default MainMap;
