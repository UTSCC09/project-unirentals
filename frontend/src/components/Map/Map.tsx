import React, {useEffect} from "react";
// import L from "leaflet";
import { Listing } from "../../api/api";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "./Map.css"


interface MapProps {
  center: [number, number];
  zoom: number;
  listings: Listing[];
  route: [number, number][];
}

const Map: React.FC<MapProps> = ({ center, zoom, listings = [], route = []}) => {
  //console.log("Map listings: ", listings);
  return (
  
      <MapContainer center={center} zoom={zoom}>
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
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
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
  //return null;
};



export default Map;