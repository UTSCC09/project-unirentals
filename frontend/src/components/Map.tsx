import React from "react";
import "../index.css";

interface MapProps {
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  // Calculate bounding box based on the zoom level
  const latDiff = 0.01 / zoom;
  const lonDiff = 0.01 / zoom;
  const bbox = `${center[1] - lonDiff},${center[0] - latDiff},${center[1] + lonDiff},${center[0] + latDiff}`;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${center[0]},${center[1]}`;

  return (
    <div id="map-container">
      <iframe
        width="100%"
        height="1250"
        src={src}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default Map;