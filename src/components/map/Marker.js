import { renderToString } from "react-dom/server";
import { DivIcon } from "leaflet";
import { Marker as LeafletMarker } from "react-leaflet";

import { categories } from "../../categories";

const Marker = ({ marker, children }) => {
  if (!marker) {
    return null;
  }

  const category = categories.find((ctg) => ctg.key === marker.category);

  return (
    <LeafletMarker
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
    </LeafletMarker>
  );
};

export default Marker;
