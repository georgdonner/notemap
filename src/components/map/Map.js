import React, { useEffect, useState, useRef } from "react";
import { renderToString } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { DivIcon } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
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

  const [inputErrors, setInputErrors] = useState({
    name: false,
    category: false,
  });
  const [newMarker, setNewMarker] = useState();
  const [currentPopupContent, setCurrentPopupContent] = useState(
    DEFAULT_POPUP_CONTENT
  );
  const [editMode, setEditMode] = useState(false);

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
      },
      popupclose: (e) => {
        setEditMode(false);
        resetPopupContent();
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

  function testFunction() {
    console.log(inputErrors);
  }

  function renderMarker(marker) {
    const category = categories.find((ctg) => ctg.key === marker.category);

    return (
      <Marker
        key={marker.id}
        position={[marker.position._lat, marker.position._long]}
        icon={
          new DivIcon({
            html: renderToString(
              <>
                <div
                  style={{ backgroundColor: marker.map.color }}
                  className="marker-pin"
                ></div>
                <category.icon color="white" />
              </>
            ),
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            className: "custom-div-icon",
          })
        }
      >
        <Popup closeOnClick={false}>
          {!editMode ? (
            <div>
              <div style={{ marginBottom: "3px" }}>
                <label style={{ fontSize: "20px" }}>
                  <b>{marker.name}</b>
                </label>
                <div>
                  <label style={{ fontSize: "14px" }}>
                    {categories.find(({ key }) => key === marker.category).name}
                  </label>
                </div>
              </div>
              {marker.description ? (
                <div style={{ marginBottom: "3px" }}>
                  <label style={{ fontSize: "16px" }}>
                    {marker.description}
                  </label>
                  <br />
                </div>
              ) : null}
              {marker.tags?.length ? (
                <div style={{ marginBottom: "3px" }}>
                  {marker.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{ fontSize: "14px", margin: "1px" }}
                      className="badge rounded-pill bg-light text-dark"
                    >
                      {tag}
                    </span>
                  ))}
                  <br />
                </div>
              ) : null}
              <div className="buttonArea d-flex justify-content-end">
                <button
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleDeleteButton(marker.id);
                  }}
                  type="button"
                  className="btn btn-danger m-1"
                >
                  Löschen
                </button>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleEditButton(marker);
                  }}
                  type="button"
                  className="btn btn-info m-1"
                >
                  Anpassen
                </button>
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
              inputErrors={inputErrors}
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
        {maps.map((map) => (
          <MarkerCollection
            key={map.id}
            map={map}
            renderMarker={renderMarker}
            singleMap={maps.length <= 1}
          />
        ))}
      </MapContainer>
      <button onClick={testFunction}>test</button>
    </div>
  );
};

export default Map;
