import { renderToString } from "react-dom/server";
import { DivIcon } from "leaflet";
import { Marker as LeafletMarker } from "react-leaflet";

import { InstantPopupMarker } from "./LeafletChildren";
import { categories } from "../../categories";

const Marker = ({ marker, center = false, children }) => {
  if (!marker) {
    return null;
  }

  const category = categories.find((ctg) => ctg.key === marker.category);

  const MarkerComponent = center ? InstantPopupMarker : LeafletMarker;

  return (
    <MarkerComponent
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
      {children}
    </MarkerComponent>
  );
};

export default Marker;
