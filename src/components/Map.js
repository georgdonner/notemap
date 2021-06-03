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
  const refContainer = useRef([]);

  const [markers, setMarkers] = useState([
    {
      id: 0,
      lat: 51.505,
      lng: -0.09,
      name: "Restaurant",
      description: "Tolles Restaurant mit gutem Essen!",
      category: "Restaurant, Asiatisch",
    },
  ]);
  const [newMarker, setNewMarker] = useState();
  const [currentPopupContent, setCurrentPopupContent] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [editMode, setEditMode] = useState(false);

  function MyComponent() {
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
    setMarkers([
      ...markers,
      {
        id: newMarker.id,
        lat: newMarker.lat,
        lng: newMarker.lng,
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
      },
    ]);

    setNewMarker(null);

    setCurrentPopupContent({
      name: "",
      description: "",
      category: "",
    });
  }

  function test() {
    console.log("test");
  }

  function handlePopupContentChange(e) {
    if (e.target.name === "name") {
      setCurrentPopupContent({
        name: e.target.value,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
      });
    } else if (e.target.name === "description") {
      setCurrentPopupContent({
        name: currentPopupContent.name,
        description: e.target.value,
        category: currentPopupContent.category,
      });
    } else if (e.target.name === "category") {
      setCurrentPopupContent({
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: e.target.value,
      });
    }
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
    setMarkers(
      markers.filter((marker) => {
        return marker.id !== id;
      })
    );
  }

  function handleEditSaveButton(id) {
    let newMakerArray = [...markers];
    newMakerArray[id] = {
      id: newMakerArray[id].id,
      lat: newMakerArray[id].lat,
      lng: newMakerArray[id].lng,
      name: currentPopupContent.name,
      description: currentPopupContent.description,
      category: currentPopupContent.category,
    };

    setMarkers([...newMakerArray]);

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
        <MyComponent />
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
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
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
      <button onClick={test}> Test</button>
    </div>
  );
};

export default Map;
