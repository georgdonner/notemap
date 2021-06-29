import { useFirestore, useUser, useFirestoreCollectionData } from "reactfire";

import Map from "./Map";

const MainMap = ({ sidebar, setSidebar }) => {
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

  return maps.length ? (
    <>
      <Map
        maps={maps}
        getMarkersRef={(mapID) =>
          firestore.collection("maps/" + mapID + "/markers")
        }
        sidebar={sidebar}
        setSidebar={setSidebar}
      />
    </>
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

export default MainMap;
