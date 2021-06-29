import { useFirestoreCollectionData, useFirestore, useUser } from "reactfire";
import { Link } from "react-router-dom";
import tinycolor from "tinycolor2";
import styled from "styled-components";

import SharedWith from "../common/SharedWith";
import Footer from "./Footer";

const lightenColor = (hex, amount = 0.99) => {
  const hsl = tinycolor(hex).toHsl();
  hsl.l = amount;
  return tinycolor(hsl).toHexString();
};

const cardBackground = (hex) => {
  const bgColor = lightenColor(hex);
  const stripesColor = lightenColor(hex, 0.975);
  return `repeating-linear-gradient(-45deg, ${bgColor}, ${bgColor} 20px, ${stripesColor} 20px, ${stripesColor} 25px)`;
};

const MapCardWrapper = styled.div`
  border-color: ${(props) => props.color};
  background-color: ${(props) => lightenColor(props.color)};
  &:hover {
    background-image: ${(props) => cardBackground(props.color)};
  }
`;

const MapCard = ({ map, owned }) => (
  <div key={map.id} className="col-md-6">
    <MapCardWrapper color={map.color} className="card p-4">
      <Link
        to={`/map/${map.id}`}
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
      {owned ? (
        <SharedWith className="fs-5 mt-3 mb-0" members={map.members} />
      ) : null}
      {!owned ? (
        <p className="fs-5 mt-3 mb-0">Geteilte Karte von {map.owner.name}</p>
      ) : null}
    </MapCardWrapper>
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
      <div className="mb-5 mt-4 d-flex justify-content-between">
        <h1>Meine Karten</h1>
        <Link
          to="/new-map"
          className="btn btn-primary"
          style={{ margin: "auto 0" }}
        >
          + Neue Karte
        </Link>
      </div>
      <div className="row g-4">
        <div className="col-12">
          <MapCardWrapper color="#000" className="card p-4">
            <Link
              to="/main-map"
              className="h3 stretched-link text-reset text-decoration-none"
            >
              Hauptkarte
            </Link>
            <p className="fs-5 mt-3 mb-0 text-secondary">
              Hier findest du alle Markierungen deiner Karten zusammengefasst
              auf einer Karte
            </p>
            <p className="fs-5 mt-3 mb-0">
              {totalMarkers} Markierung{totalMarkers !== 1 ? "en" : ""} von{" "}
              {allMaps.length} Karte
              {allMaps.length !== 1 ? "n" : ""}
            </p>
          </MapCardWrapper>
        </div>

        {allMaps.map((map) => (
          <MapCard key={map.id} map={map} owned={map.owner.id === user.uid} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MapList;
