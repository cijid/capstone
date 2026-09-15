import {
  Circle,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function AreaMap({ location }) {
  const defaultLocation = {
    name: "Colorado Springs, Colorado",
    x_coord: -104.8214,
    y_coord: 38.8339,
    radius: 45,
  };

  const mapLocation =
    location || defaultLocation;

  const latitude =
    Number(mapLocation.y_coord);

  const longitude =
    Number(mapLocation.x_coord);

  const radiusMiles =
    Number(mapLocation.radius);

  const position = [
    latitude,
    longitude,
  ];

  const milesToMeters = (miles) =>
    miles * 1609.344;

  const radiusMeters =
    milesToMeters(radiusMiles);

  return (
    <div className="page-container">
      <div
        className="map-container"
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <MapContainer
          key={`${latitude}-${longitude}-${radiusMiles}`}
          center={position}
          zoom={6}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Circle
            center={position}
            radius={radiusMeters}
          >
            <Popup>
              <p>
                <strong>
                  {mapLocation.name}
                </strong>
                <br />
                Impact Radius:{" "}
                {radiusMiles} miles
                <br />
                Position:{" "}
                {latitude},{" "}
                {longitude}
              </p>
            </Popup>
          </Circle>
        </MapContainer>
      </div>
    </div>
  );
}

export default AreaMap;