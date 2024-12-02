import React, {useEffect} from "react";
// import L from "leaflet";
import { Listing } from "../../api/api";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";


interface MapProps {
  center: [number, number];
  zoom: number;
  listings: Listing[];
}

const Map: React.FC<MapProps> = ({ center, zoom, listings = []}) => {
  console.log("Map listings: ", listings);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', zIndex:0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {listings.map((listing, index) => (
          <Marker key={index} position={[listing.latitude, listing.longitude]}>
            <Popup>
              {listing.address}
            </Popup>
          </Marker>
        ))}
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return (
    <Marker position={center}>
      <Popup>
        Center Location
      </Popup>
    </Marker>
  );
};



export default Map;