import React, {useEffect, useState} from 'react'
import '../App.css'
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';

const Map = () => {

    let popMarker = true;

    const [markers, setMarkers] = useState([]);
    const [creationFinished, setCreationFinished] = useState(true);

    const SearchField = () => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider: provider,
        });

        const map = useMap();
        useEffect(() => {
            map.addControl(searchControl);
            return () => map.removeControl(searchControl);
        });

        return null;
    };

    function MyComponent() {
        useMapEvents({
            click: (e) => {
                if (creationFinished) {
                    setNewMarker(e);
                    setCreationFinished(false);
                } else {
                    alert("Bitte beenden Sie zuerst die Erstellung des aktuellen Markers");
                }
            },
            popupclose: (e) => {
                handleCloseButton(e);
            },
        });

        return null
    }

    function setNewMarker(e) {
        setMarkers([...markers, {
            id: markers.length,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            description: "description",
            name: "name",
            category: "category"
        }]);
       // console.log(e.originalEvent.path[4]);
       // e.originalEvent.path[4].children[1].children[0].children[0].children[0].children[5].click();
    }

    function popMarkers() {
        setMarkers(markers.filter(marker => marker.id !== markers.length - 1));
    }

    function handleCloseButton(e) {
        if (popMarker) popMarkers();
        setCreationFinished(true);
        popMarker = true;
    }

    function handleSaveButton(e) {
        popMarker = false;
        e.nativeEvent.path[4].children[2].click();
    }

    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <SearchField/>
                <MyComponent/>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) =>
                    <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                        {creationFinished ?
                            <div></div> :
                            <div className="newMarkerPopup">
                                <Popup id={marker.id} closeButton={true} closeOnClick={false}>
                                    <div style={{marginBottom: "3px"}}>
                                        <label>
                                            Name: <br/>
                                            <input style={{marginLeft: "3px"}} type="text" name="name"/>
                                        </label><br/>
                                    </div>
                                    <div style={{marginBottom: "3px"}}>
                                        <label>
                                            Beschreibung: <br/>
                                            <input style={{marginLeft: "3px"}} type="text" name="description"/>
                                        </label><br/></div>
                                    <div style={{marginBottom: "3px"}}>
                                        <label>
                                            Kategorie: <br/>
                                            <input style={{marginLeft: "3px"}} type="text" name="categorie"/>
                                        </label><br/>
                                    </div>
                                    <div style={{marginLeft: "3px"}}>
                                        <button onClick={handleSaveButton}> Speichern</button>
                                    </div>
                                </Popup>
                            </div>}

                    </Marker>
                )}
            </MapContainer>
            {markers.map((marker) =>
                <li key={marker.id}>{marker.lat} {marker.lng}</li>
            )}
        </div>
    )
};

export default Map
