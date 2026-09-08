import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



function AreaMap() {
  const [latCoord, setLatCoord] = useState("")
  const [longCoord, setLongCoord] = useState("")
  const position = [38, -104]; // [Lat, Long]

  // setLatCoord(position[0])
  // setLongCoord(position[1])
  //Replace with real data later
  const capabilityStatus = {
    capability: "UHF",
    status: "Degraded",
    latitude: 38,
    longitude: -104,
    rangeMiles: 100,
  };

    const milesToMeters = (miles) => {
    return miles * 1609.344;
  };

  const radiusMeters = milesToMeters(capabilityStatus.rangeMiles)

  return (
    <div className ="page-container">
      <div className ="header-container">
      </div>
      <div className ="map-container" style={{ height: '500px', width: '100%' }}>
        <MapContainer center={position} zoom={5} style={{height: '100%', width: '100%'}}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

          <Circle
          center={[
            capabilityStatus.latitude,
            capabilityStatus.longitude
          ]}
          radius={radiusMeters}>
          <Popup>
           <p>
            Capability: {capabilityStatus.capability} <br />
            Status: {capabilityStatus.status} <br />
            Impact Radius: {capabilityStatus.rangeMiles} miles <br />
            Position selected: {capabilityStatus.latitude},{" "}{capabilityStatus.longitude} </p>
          </Popup>
        </Circle>
        </MapContainer>


        </div>


    </div>

  )


}
export default AreaMap;