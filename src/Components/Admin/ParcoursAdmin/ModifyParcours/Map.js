import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const markerIcon = new L.Icon({
    iconUrl: require("../../../../assets/marker.png"),
    iconSize: [35, 45],
  });
  return (
    <MapContainer
      className="mapContainerAdmin"
      center={[43.269605, 5.394641]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* {allStep.map((item) => {
                return (
                  <Marker
                    position={item.localisation}
                    key={item.localisation}
                    icon={markerIcon}
                  >
                    <Popup>
                      {item.nomEtape} <br /> {item.descriptionEtape}
                    </Popup>
                  </Marker>
                );
              })} */}
    </MapContainer>
  );
}
