import { useFirestoreCollectionData, useFirestore } from "reactfire";
import { Link } from "react-router-dom";
import tinycolor from "tinycolor2";

const lightenColor = (hex) => {
  const hsl = tinycolor(hex).toHsl();
  hsl.l = 0.99;
  return tinycolor(hsl).toHexString();
};

const MapList = () => {
  const firestore = useFirestore();
  const mapCollection = firestore.collection("map");

  const { status, data: maps } = useFirestoreCollectionData(mapCollection, {
    idField: "id",
    initialData: [],
  });

  const totalMarkers = maps.reduce((a, c) => a + c.markerCount || 0, 0);

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
              {totalMarkers} Markierung{totalMarkers > 1 ? "en" : ""} von{" "}
              {maps.length} Karte
              {maps.length > 1 ? "n" : ""}
            </p>
          </div>
        </div>

        {maps.map((map) => (
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
                <p className="fs-5 mt-3 mb-0 text-secondary">
                  {map.description}
                </p>
              ) : null}
              <p className="fs-5 mt-3 mb-0">
                {map.markerCount} Markierung{map.markerCount > 1 ? "en" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapList;
