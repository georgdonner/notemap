import { useFirestoreCollectionData, useFirestore, useUser } from "reactfire";
import { Link } from "react-router-dom";
import tinycolor from "tinycolor2";

const lightenColor = (hex) => {
  const hsl = tinycolor(hex).toHsl();
  hsl.l = 0.99;
  return tinycolor(hsl).toHexString();
};

const SharedWith = ({ members }) => {
  const memberNames = Object.values(members).map((member) => member.name);
  if (!memberNames.length) {
    return null;
  }

  if (memberNames.length > 3) {
    return (
      <p className="fs-5 mt-3 mb-0">
        Geteilt mit {memberNames.length} Freund:innen
      </p>
    );
  }

  let membersString = "";
  if (memberNames.length > 2) {
    membersString = `${memberNames.slice(0, -1).join(", ")} und ${
      memberNames[memberNames.length - 1]
    }`;
  } else {
    membersString = memberNames.join(" und ");
  }

  return <p className="fs-5 mt-3 mb-0">Geteilt mit {membersString}</p>;
};

const MapCard = ({ map, owned }) => (
  <div key={map.id} className="col-md-6">
    <div
      className="card p-4"
      style={{
        borderColor: map.color,
        backgroundColor: lightenColor(map.color),
      }}
    >
      <Link
        to={`map/${map.id}`}
        className="h3 stretched-link text-reset text-decoration-none"
      >
        {map.name}
      </Link>
      {map.description ? (
        <p className="fs-5 mt-3 mb-0 text-secondary">{map.description}</p>
      ) : null}
      <p className="fs-5 mt-3 mb-0">
        {map.markerCount || 0} Markierung{map.markerCount !== 1 ? "en" : ""}
      </p>
      {owned && map.members ? <SharedWith members={map.members} /> : null}
      {!owned ? (
        <p className="fs-5 mt-3 mb-0">Geteilte Karte von {map.owner.name}</p>
      ) : null}
    </div>
  </div>
);

const MapList = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();

  const mapCollection = firestore.collection("maps");

  const ownedQuery = mapCollection.where("owner.id", "==", user.uid);
  const { data: ownedMaps } = useFirestoreCollectionData(ownedQuery, {
    idField: "id",
    initialData: [],
  });

  const sharedQuery = mapCollection.where(
    `members.${user.uid}.name`,
    ">",
    "''"
  );
  const { data: sharedMaps } = useFirestoreCollectionData(sharedQuery, {
    idField: "id",
    initialData: [],
  });

  const allMaps = ownedMaps.concat(sharedMaps);

  const totalMarkers = allMaps.reduce((a, c) => a + (c.markerCount || 0), 0);

  return (
    <div className="container p-4" style={{ maxWidth: "1000px" }}>
      <h1 className="mt-4 mb-5">Meine Karten</h1>
      <div className="row g-4">
        <div className="col-12">
          <div
            className="card p-4"
            style={{
              borderColor: "#000",
              backgroundColor: lightenColor("#000"),
            }}
          >
            <Link
              to="/main-map"
              className="h3 stretched-link text-reset text-decoration-none"
            >
              Hauptkarte
            </Link>
            <p className="fs-5 mt-3 mb-0 text-secondary">
              Hier finden Sie alle Markierungen Ihrer Karten zusammengefasst auf
              einer Karte
            </p>
            <p className="fs-5 mt-3 mb-0">
              {totalMarkers} Markierung{totalMarkers !== 1 ? "en" : ""} von{" "}
              {allMaps.length} Karte
              {allMaps.length !== 1 ? "n" : ""}
            </p>
          </div>
        </div>

        {allMaps.map((map) => (
          <MapCard key={map.id} map={map} owned={map.owner.id === user.uid} />
        ))}
      </div>
    </div>
  );
};

export default MapList;
