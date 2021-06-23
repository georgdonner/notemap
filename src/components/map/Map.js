import React, { useState } from "react";
import { MapContainer, TileLayer, Popup, useMapEvents } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { useFirestore, useUser } from "reactfire";

import Marker from "./Marker";
import MarkerForm from "./MarkerForm";
import MarkerContent from "./MarkerContent";
import {
  SearchField,
  InstantPopupMarker,
  CenterMap,
  FitToBounds,
} from "./LeafletChildren";
import Sidebar from "../sidebar/Sidebar";
import useMarkers from "../../hooks/useMarkers";

const DEFAULT_POPUP_CONTENT = Object.freeze({
  name: "",
  description: "",
  category: "",
  tag: "",
  tags: [],
});

const Map = ({ getMarkersRef, maps }) => {
  const { GeoPoint } = useFirestore;
  const { data: user } = useUser();

  const [inputErrors, setInputErrors] = useState({
    name: false,
    category: false,
  });
  const [newMarker, setNewMarker] = useState();
  const [currentPopupContent, setCurrentPopupContent] = useState(
    DEFAULT_POPUP_CONTENT
  );
  const [editMode, setEditMode] = useState(false);
  const [centerMarker, setCenterMarker] = useState(null);
  const [{ markers, mapsFetched }, searchIndex] = useMarkers(maps);

  function resetPopupContent() {
    setCurrentPopupContent(DEFAULT_POPUP_CONTENT);
    setNewMarker(null);
    setInputErrors({
      name: false,
      category: false,
    });
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
        setCenterMarker(null);
      },
      popupclose: (e) => {
        setEditMode(false);
        resetPopupContent();
        setCenterMarker(null);
      },
    });

    return null;
  }

  function handleSaveButton() {
    let nameError = false,
      categoryError = false;

    if (currentPopupContent.name === "") {
      nameError = true;
    }

    if (currentPopupContent.category === "") {
      categoryError = true;
    }

    setInputErrors({ name: nameError, category: categoryError });

    if (nameError === false && categoryError === false) {
      getMarkersRef()
        .add({
          position: new GeoPoint(newMarker.lat, newMarker.lng),
          name: currentPopupContent.name,
          description: currentPopupContent.description,
          category: currentPopupContent.category,
          tags: currentPopupContent.tags,
          user: user.uid,
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

  function handleDeleteButton(marker) {
    getMarkersRef(marker.map.id)
      .doc(marker.id)
      .delete()
      .then((result) => {
        console.log("Marker deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditSaveButton(marker) {
    let nameError = false,
      categoryError = false;

    if (currentPopupContent.name === "") {
      nameError = true;
    }

    if (currentPopupContent.category === "") {
      categoryError = true;
    }

    setInputErrors({ name: nameError, category: categoryError });

    if (nameError === false && categoryError === false) {
      getMarkersRef(marker.map.id)
        .doc(marker.id)
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

  function centerOnMarker(marker) {
    setCenterMarker(marker);
  }

  return (
    <div className="d-flex">
      <Sidebar
        searchIndex={searchIndex}
        centerOnMarker={centerOnMarker}
        map={maps.length === 1 ? maps[0] : null}
      />
      <MapContainer center={[51.341971, 12.37409]} zoom={13}>
        <CenterMap
          centerPosition={
            centerMarker
              ? [centerMarker.position._lat, centerMarker.position._long]
              : null
          }
        />
        <SearchField />
        <MapEvents />
        {maps.length === mapsFetched.length ? (
          <FitToBounds markers={markers} />
        ) : null}

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
        />
        {newMarker ? (
          <InstantPopupMarker position={[newMarker.lat, newMarker.lng]}>
            <div>
              <Popup
                onClose={() => setNewMarker(null)}
                closeOnClick={false}
                style={{ maxWidth: "200px" }}
              >
                <MarkerForm
                  content={currentPopupContent}
                  onChange={handlePopupContentChange}
                  addTag={addTag}
                  deleteTag={deleteTag}
                  onSave={handleSaveButton}
                  errors
                  inputErrors={inputErrors}
                />
              </Popup>
            </div>
          </InstantPopupMarker>
        ) : null}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            marker={marker}
            center={centerMarker?.id === marker.id}
          >
            <Popup closeOnClick={false}>
              {!editMode ? (
                <MarkerContent
                  marker={marker}
                  onDelete={handleDeleteButton}
                  onEdit={handleEditButton}
                />
              ) : (
                <MarkerForm
                  content={currentPopupContent}
                  onChange={handlePopupContentChange}
                  addTag={addTag}
                  deleteTag={deleteTag}
                  onEdit={() => handleEditSaveButton(marker)}
                  editMode
                  inputErrors={inputErrors}
                />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
