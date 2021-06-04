import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { FaTrashAlt, FaEdit, FaSave } from "react-icons/fa";
import "firebase/firestore";
import {
  useFirestoreDocData,
  useFirestore,
  useFirebaseApp,
  useFirestoreCollectionData,
} from "reactfire";

const SearchField = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

const MyMarker = (props) => {
  const leafletRef = useRef();
  useEffect(() => {
    leafletRef.current.openPopup();
  }, []);
  return <Marker ref={leafletRef} {...props} />;
};

const Map = () => {
  const markersRef = useFirestore().collection("marker");

  const { status, data } = useFirestoreCollectionData(markersRef);

  const markers = (data || []).map((marker) => {
    return { ...marker, id: marker.NO_ID_FIELD };
  });

  if (status === "loading") {
    console.log("Daten werden geladen!");
  }

  const [newMarker, setNewMarker] = useState();
  const [currentPopupContent, setCurrentPopupContent] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [editMode, setEditMode] = useState(false);

  function MapEvents() {
    useMapEvents({
      click: (e) => {
        setNewMarker({
          id: markers.length,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          name: currentPopupContent.name,
          description: currentPopupContent.description,
          category: currentPopupContent.category,
        });
      },
      popupclose: (e) => {
        setEditMode(false);
        setCurrentPopupContent({
          name: "",
          description: "",
          category: "",
        });
      },
    });

    return null;
  }

  function handleSaveButton() {
    markersRef
      .add({
        position: [newMarker.lat, newMarker.lng],
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
        map: "xWW0J3cU3KpdP3vEarom", // Change later to actual map
      })
      .then((result) => {
        console.log("Marker added");
      })
      .catch((error) => {
        console.log(error);
      });

    setNewMarker(null);

    setCurrentPopupContent({
      name: "",
      description: "",
      category: "",
    });
  }

  function handlePopupContentChange(e) {
    setCurrentPopupContent({
      ...currentPopupContent,
      [e.target.name]: e.target.value,
    });
  }

  function handleEditButton(marker) {
    setCurrentPopupContent({
      name: marker.name,
      description: marker.description,
      category: marker.category,
    });
    setEditMode(!editMode);
  }

  function handleDeleteButton(id) {
    markersRef
      .doc(id)
      .delete()
      .then((result) => {
        console.log("Marker deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditSaveButton(id) {
    markersRef
      .doc(id)
      .update({
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
      })
      .then((result) => {
        console.log("Marker edited");
      })
      .catch((error) => {
        console.log(error);
      });

    setCurrentPopupContent({
      name: "",
      description: "",
      category: "",
    });

    setEditMode(false);
  }

  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13}>
        <SearchField />
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {newMarker ? (
          <MyMarker position={[newMarker.lat, newMarker.lng]}>
            <Popup onClose={() => setNewMarker(null)} closeOnClick={false}>
              <div style={{ marginBottom: "3px" }}>
                <label>
                  Name: <br />
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="name"
                    value={currentPopupContent.name}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                </label>
                <br />
              </div>
              <div style={{ marginBottom: "3px" }}>
                <label>
                  Beschreibung: <br />
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="description"
                    value={currentPopupContent.description}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                </label>
                <br />
              </div>
              <div style={{ marginBottom: "3px" }}>
                <label>
                  Kategorie: <br />
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="category"
                    value={currentPopupContent.category}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                </label>
                <br />
              </div>
              <div style={{ marginLeft: "3px" }}>
                <button
                  onClick={() => {
                    handleSaveButton();
                  }}
                >
                  {" "}
                  Speichern
                </button>
              </div>
            </Popup>
          </MyMarker>
        ) : null}
        {markers?.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup closeOnClick={false}>
              {!editMode ? (
                <div>
                  <div style={{ marginBottom: "3px" }}>
                    <label>
                      <b>{marker.name}</b>
                    </label>
                    <br />
                  </div>
                  <div style={{ marginBottom: "3px" }}>
                    <label>{marker.description}</label>
                    <br />
                  </div>
                  <div style={{ marginBottom: "3px" }}>
                    <label>{marker.category}</label>
                    <br />
                    <div className="buttonArea">
                      <FaEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleEditButton(marker);
                        }}
                      />
                      <FaTrashAlt
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleDeleteButton(marker.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="name"
                    value={currentPopupContent.name}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                  <br />
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="description"
                    value={currentPopupContent.description}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                  <br />
                  <input
                    style={{ marginLeft: "3px" }}
                    type="text"
                    name="category"
                    value={currentPopupContent.category}
                    onChange={(e) => {
                      handlePopupContentChange(e);
                    }}
                  />
                  <br />
                  <FaSave
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleEditSaveButton(marker.id);
                    }}
                  />
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
