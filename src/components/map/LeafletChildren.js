import React, { useEffect, useState, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export const SearchField = () => {
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

export const InstantPopupMarker = ({ children, ...props }) => {
  const leafletRef = useRef();
  useEffect(() => {
    leafletRef.current.openPopup();
  }, []);
  return (
    <Marker ref={leafletRef} {...props}>
      {children}
    </Marker>
  );
};

export const CenterMap = ({ centerPosition }) => {
  const leafletMap = useMap();

  useEffect(() => {
    if (centerPosition) {
      const currentZoom = leafletMap.getZoom();
      const targetZoom = Math.max(currentZoom, 16);
      leafletMap.setView(centerPosition, targetZoom);
    }
  }, [centerPosition, leafletMap]);

  return null;
};

export const FitToBounds = ({ markers }) => {
  const leafletMap = useMap();
  const [centered, setCentered] = useState();

  useEffect(() => {
    if (!centered && markers.length) {
      let minLat, minLong, maxLat, maxLong;
      for (const marker of markers) {
        const { _lat: lat, _long: long } = marker.position;
        if (!minLat || lat < minLat) {
          minLat = lat;
        }
        if (!minLong || long < minLong) {
          minLong = long;
        }
        if (!maxLat || lat > maxLat) {
          maxLat = lat;
        }
        if (!maxLong || long > maxLong) {
          maxLong = long;
        }
      }
      if (minLat && maxLat && minLong && maxLong) {
        const newBounds = new LatLngBounds(
          [maxLat, minLong],
          [minLat, maxLong]
        );
        setCentered(true);
        leafletMap.fitBounds(newBounds, {
          maxZoom: 16,
        });
      }
    }
  }, [centered, leafletMap, markers]);

  return null;
};
