import React, { useEffect, useState, useRef } from "react";
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
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useFirestore } from "reactfire";

import MarkerForm from "./MarkerForm";
import MarkerCollection from "./MarkerCollection";
import { categories } from "../../categories";

const SearchField = () => {
  const leafletMap = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider: provider,
      showMarker: false,
      autoClose: true,
      searchLabel: "Adresse eingeben",
    });

    leafletMap.addControl(searchControl);
    return () => leafletMap.removeControl(searchControl);
  }, [leafletMap]);

  return null;
};

const InstantPopupMarker = (props) => {
  const leafletRef = useRef();
  useEffect(() => {
    leafletRef.current.openPopup();
  }, []);
  return <Marker ref={leafletRef} {...props} />;
};

const DEFAULT_POPUP_CONTENT = Object.freeze({
  name: "",
  description: "",
  category: "",
  tag: "",
  tags: [],
});

const Map = ({ getMarkersRef, maps }) => {
  const { GeoPoint } = useFirestore;

  const [newMarker, setNewMarker] = useState();
  const [currentPopupContent, setCurrentPopupContent] = useState(
    DEFAULT_POPUP_CONTENT
  );
  const [editMode, setEditMode] = useState(false);

  function resetPopupContent() {
    setCurrentPopupContent(DEFAULT_POPUP_CONTENT);
  }

  function MapEvents() {
    useMapEvents({
      click: (e) => {
        setNewMarker({
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          name: currentPopupContent.name,
          description: currentPopupContent.description,
          category: currentPopupContent.category,
        });
      },
      popupclose: (e) => {
        setEditMode(false);
        resetPopupContent();
      },
    });

    return null;
  }

  function handleSaveButton() {
    getMarkersRef()
      .add({
        position: new GeoPoint(newMarker.lat, newMarker.lng),
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
        tags: currentPopupContent.tags,
      })
      .then((result) => {
        console.log("Marker added");
      })
      .catch((error) => {
        console.log(error);
      });

    setNewMarker(null);
    resetPopupContent();
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
      tag: "",
      tags: marker.tags || [],
    });
    setEditMode(true);
  }

  function handleDeleteButton(id) {
    getMarkersRef()
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
    getMarkersRef()
      .doc(id)
      .update({
        name: currentPopupContent.name,
        description: currentPopupContent.description,
        category: currentPopupContent.category,
        tags: currentPopupContent.tags,
      })
      .then((result) => {
        console.log("Marker edited");
      })
      .catch((error) => {
        console.log(error);
      });

    resetPopupContent();
    setEditMode(false);
  }

  function addTag() {
    const { tag, tags } = currentPopupContent;
    if (!tags.includes(tag)) {
      setCurrentPopupContent({
        ...currentPopupContent,
        tags: [...tags, tag],
        tag: "",
      });
    }
  }

  function deleteTag(deletedTag) {
    setCurrentPopupContent({
      ...currentPopupContent,
      tags: currentPopupContent.tags.filter((tag) => deletedTag !== tag),
    });
  }

  function testFunction(e) {
    console.log(currentPopupContent.tags);
  }

  function renderMarker(marker) {
    return (
      <Marker
        key={marker.id}
        position={[marker.position._lat, marker.position._long]}
      >
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
                <label>
                  {categories.find(({ key }) => key === marker.category).name}
                </label>
                <br />
              </div>
              {marker.tags?.length ? (
                <div style={{ marginBottom: "3px" }}>
                  {marker.tags.map((tag) => (
                    <div key={tag}>{tag}</div>
                  ))}
                  <br />
                </div>
              ) : null}
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
          ) : (
            //edit mode starts here
            <MarkerForm
              content={currentPopupContent}
              onChange={handlePopupContentChange}
              addTag={addTag}
              deleteTag={deleteTag}
              onEdit={() => handleEditSaveButton(marker.id)}
              editMode
            />
          )}
        </Popup>
      </Marker>
    );
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
          <InstantPopupMarker position={[newMarker.lat, newMarker.lng]}>
            <Popup onClose={() => setNewMarker(null)} closeOnClick={false}>
              <MarkerForm
                content={currentPopupContent}
                onChange={handlePopupContentChange}
                addTag={addTag}
                deleteTag={deleteTag}
                onSave={handleSaveButton}
              />
            </Popup>
          </InstantPopupMarker>
        ) : null}
        {maps.map((map) => (
          <MarkerCollection
            key={map.id}
            map={map}
            renderMarker={renderMarker}
          />
        ))}
      </MapContainer>
      <button onClick={testFunction}>TEst</button>
    </div>
  );
};

export default Map;
