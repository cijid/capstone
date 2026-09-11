import { useEffect } from "react";

import L from "leaflet";

import {
  Circle,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function MapBoundsController({
  locations,
}) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) {
      return;
    }

    const bounds = L.latLngBounds([]);

    locations.forEach((location) => {
      const latitude = Number(
        location.y_coord
      );

      const longitude = Number(
        location.x_coord
      );

      const radiusMiles = Number(
        location.radius
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      const radiusMeters =
        Number.isFinite(radiusMiles)
          ? radiusMiles * 1609.344
          : 0;

      const center = L.latLng(
        latitude,
        longitude
      );

      if (radiusMeters > 0) {
        const locationBounds =
          center.toBounds(
            radiusMeters * 2
          );

        bounds.extend(
          locationBounds
        );
      } else {
        bounds.extend(center);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 8,
      });
    }
  }, [locations, map]);

  return null;
}

function AreaMap({
  location,
  locations,
}) {
  let mapLocations = [];

  if (
    Array.isArray(locations)
  ) {
    mapLocations = locations;
  } else if (location) {
    mapLocations = [location];
  }

  const validLocations =
    mapLocations.filter(
      (mapLocation) => {
        const latitude = Number(
          mapLocation?.y_coord
        );

        const longitude = Number(
          mapLocation?.x_coord
        );

        return (
          Number.isFinite(
            latitude
          ) &&
          Number.isFinite(
            longitude
          )
        );
      }
    );

  if (
    validLocations.length === 0
  ) {
    return (
      <div className="page-container">
        <div
          className="map-container"
          style={{
            height: "500px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
          }}
        >
          <p>
            No current degradation
            locations are available.
          </p>
        </div>
      </div>
    );
  }

  const firstLocation =
    validLocations[0];

  const initialPosition = [
    Number(
      firstLocation.y_coord
    ),
    Number(
      firstLocation.x_coord
    ),
  ];

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
          center={
            initialPosition
          }
          zoom={5}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsController
            locations={
              validLocations
            }
          />

          {validLocations.map(
            (
              mapLocation,
              index
            ) => {
              const latitude =
                Number(
                  mapLocation.y_coord
                );

              const longitude =
                Number(
                  mapLocation.x_coord
                );

              const radiusMiles =
                Number(
                  mapLocation.radius
                );

              const safeRadiusMiles =
                Number.isFinite(
                  radiusMiles
                )
                  ? radiusMiles
                  : 0;

              const radiusMeters =
                safeRadiusMiles *
                1609.344;

              const position = [
                latitude,
                longitude,
              ];

              const key =
                mapLocation.id ||
                `${latitude}-${longitude}-${index}`;

              return (
                <Circle
                  key={key}
                  center={
                    position
                  }
                  radius={
                    radiusMeters
                  }
                >
                  <Popup>
                    <div>
                      <strong>
                        {mapLocation.effectTitle ||
                          mapLocation.name ||
                          "Degradation Area"}
                      </strong>

                      {mapLocation.effectTitle &&
                        mapLocation.name && (
                          <>
                            <br />
                            Location:{" "}
                            {
                              mapLocation.name
                            }
                          </>
                        )}

                      {mapLocation.capability && (
                        <>
                          <br />
                          Capability:{" "}
                          {
                            mapLocation.capability
                          }
                        </>
                      )}

                      <br />
                      Impact Radius:{" "}
                      {
                        safeRadiusMiles
                      }{" "}
                      miles

                      <br />
                      Position:{" "}
                      {latitude},{" "}
                      {longitude}
                    </div>
                  </Popup>
                </Circle>
              );
            }
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default AreaMap;