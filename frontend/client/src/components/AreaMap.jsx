import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function AreaMap() {
  const [latCoord, setLatCoord] = useState("")
  const [longCoord, setLongCoord] = useState("")
  const position = [38, -104]; // [Lat, Long]

  // setLatCoord(position[0])
  // setLongCoord(position[1])


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

          <CircleMarker
          center={position}
          radius={15}>
          <Popup>
           <p> A pretty CSS3 popup. <br /> Easily Customizable <br /> Position selected: {position[0]}, {position[1]} </p>
          </Popup>
        </CircleMarker>
        </MapContainer>


        </div>


    </div>

  )


}
export default AreaMap;