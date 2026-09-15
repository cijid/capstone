import { useState } from "react";
import { divIcon } from "leaflet";

import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";

import { satellites } from "../data/satellites";
import { satelliteGeometry } from "../utils/satelliteGeometry";

import "leaflet/dist/leaflet.css";
import "../styles/satelliteMap.css";

const defaultLocation = {
  name: "Colorado Springs, Colorado",
  x_coord: -104.8214,
  y_coord: 38.8339,
  radius: 45,
};

const satelliteIcon = divIcon({
  className: "satellite-icon",
  html: '<span aria-hidden="true">🛰</span>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function ObserverPicker({ onSelect }) {
  useMapEvents({
    click(event) {
      const latitude = event.latlng.lat;

      // Keep longitude between -180 and 180 when the map wraps.
      const longitude =
        ((event.latlng.lng + 180) % 360 + 360) % 360 - 180;

      onSelect({
        latitude,
        longitude,
        name: "Selected map point",
      });
    },
  });

  return null;
}

function SatelliteDetails({ satellite }) {
  return (
    <div className="satellite-details">
      <strong>{satellite.name}</strong>

      <br />

      Distance: {satellite.distanceKm.toFixed(1)} km

      <br />

      Altitude: {satellite.altitudeKm} km

      <br />

      Azimuth:{" "}
      {satellite.azimuthDeg == null
        ? "Undefined — directly overhead or below"
        : `${satellite.azimuthDeg.toFixed(1)}° true`}

      <br />

      Elevation: {satellite.elevationDeg.toFixed(1)}°

      <br />

      LOS:{" "}
      {satellite.hasLineOfSight
        ? "Above horizon"
        : "Blocked by Earth / at horizon"}
    </div>
  );
}

function SatelliteMap({ mapLocation }) {
  const latitude = Number(mapLocation.y_coord);
  const longitude = Number(mapLocation.x_coord);

  const suppliedRadius = Number(mapLocation.radius);

  const radiusMiles =
    Number.isFinite(suppliedRadius) && suppliedRadius >= 0
      ? suppliedRadius
      : 45;

  const reportPosition = [latitude, longitude];

  const [observer, setObserver] = useState({
    latitude,
    longitude,
    name: mapLocation.name || "Report location",
  });

  // Calculate distance and LOS for every satellite,
  // then put the nearest satellite first.
  const rankedSatellites = satellites
    .map((satellite) => ({
      ...satellite,
      ...satelliteGeometry(observer, satellite),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  function resetObserver() {
    setObserver({
      latitude,
      longitude,
      name: mapLocation.name || "Report location",
    });
  }

  return (
    <div className="satellite-explorer">
      <div className="satellite-info">
        <strong>Satellite Finder</strong>

        <p>
          Observer: {observer.name}
          <br />
          {observer.latitude.toFixed(4)},{" "}
          {observer.longitude.toFixed(4)}
        </p>

        <p>
          Click an empty map point.
        </p>

        <button type="button" onClick={resetObserver}>
          Use report location
        </button>
      </div>

      <MapContainer
        center={reportPosition}
        zoom={4}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ObserverPicker onSelect={setObserver} />

        <Circle
          center={reportPosition}
          radius={radiusMiles * 1609.344}
        >
          <Popup>
            <strong>{mapLocation.name}</strong>
            <br />
            Impact radius: {radiusMiles} miles
          </Popup>
        </Circle>

        <CircleMarker
          center={[
            observer.latitude,
            observer.longitude,
          ]}
          radius={8}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#2563eb",
            fillOpacity: 1,
            weight: 3,
          }}
        >
          <Tooltip>
            Observer: {observer.name}
          </Tooltip>
        </CircleMarker>

        {rankedSatellites.map((satellite) => (
          <Marker
            key={satellite.id}
            position={[
              satellite.latitude,
              satellite.longitude,
            ]}
            icon={satelliteIcon}
            title={satellite.name}
            alt={satellite.name}
          >
            <Tooltip
              direction="top"
              offset={[0, -18]}
            >
              <SatelliteDetails satellite={satellite} />
            </Tooltip>

            <Popup>
              <SatelliteDetails satellite={satellite} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="satellite-list">
        <strong>Satellites by distance</strong>

        <ol>
          {rankedSatellites.map((satellite) => (
            <li key={satellite.id}>
              {satellite.name}
              {" — "}
              {satellite.distanceKm.toFixed(1)} km
              {" · "}
              {satellite.hasLineOfSight
                ? "Above horizon"
                : "No LOS"}
            </li>
          ))}
        </ol>

      </div>
    </div>
  );
}


export default function AreaMap({ location }) {
  const candidate = location || defaultLocation;

  const latitude = Number(candidate.y_coord);
  const longitude = Number(candidate.x_coord);

  const hasValidCoordinates =
    candidate.y_coord != null &&
    candidate.x_coord != null &&
    String(candidate.y_coord).trim() !== "" &&
    String(candidate.x_coord).trim() !== "" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;

  const mapLocation = hasValidCoordinates
    ? candidate
    : defaultLocation;

  return (
    <SatelliteMap
      key={`${mapLocation.y_coord}-${mapLocation.x_coord}-${mapLocation.name}`}
      mapLocation={mapLocation}
    />
  );
}