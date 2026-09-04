import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function AreaMap() {
  const position = [38, -104]; // [Lat, Long]

  return (
    <div className ="page-container">
      <div className ="header-container">
      </div>
      <div className ="map-container" style={{ height: '500px', width: '100%' }}>
        <MapContainer center={position} zoom={13} style={{height: '100%', width: '100%'}}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

          <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily Customizable <br /> Position selected: {position}.
          </Popup>
        </Marker>
        </MapContainer>


        </div>


    </div>

  )


}
export default AreaMap;