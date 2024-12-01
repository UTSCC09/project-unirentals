import React, {useEffect} from "react";
import L from "leaflet";
import { Listing } from "../api/api";
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
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <MapContainer center={center} zoom={zoom} style={{ height: '50vh', width: '50vw' }}>
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

  return null;
};


export default Map;