import React, { useEffect } from 'react'
import '../App.css'
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

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
    }, []);

    return null;
};

function Map() {
    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                <SearchField />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        Test Popup <br/> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default Map
