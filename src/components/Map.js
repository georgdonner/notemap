import React, {useEffect, useState} from 'react'
import '../App.css'
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet'
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';

const Map = () => {

    const [markers, setMarkers] = useState([]);

    const SearchField = () => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider: provider,
            showMarker: false,
            autoClose: true
        });

        const map = useMap();
        useEffect(() => {
            map.addControl(searchControl);
            return () => map.removeControl(searchControl);
        });

        return null;
    };

    const Markers = () => {

        useMapEvents({
            click(e) {
                setNewMarker(e);
            },
        });

        return null;

    };

    function setNewMarker(e) {
        setMarkers([...markers, {id: markers.length, lat: e.latlng.lat, lng: e.latlng.lng, description: "description"}]);
    }

    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <SearchField/>
                <Markers/>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) =>
                    <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                        <Popup>
                            {marker.description}
                        </Popup>
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
