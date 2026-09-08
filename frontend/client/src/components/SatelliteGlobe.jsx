import { useEffect, useMemo, useState } from "react";

import { Viewer } from "resium";

import {
  Cartesian3,
  Color,
  ImageryLayer,
  OpenStreetMapImageryProvider,
} from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";

import Satellite from "./Satellite";
import OrbitTrail from "./OrbitTrail";
import GroundLocation from "./GroundLocation";
import LineOfSight from "./LineOfSight";
import CoverageFootprint from "./CoverageFootprint";

import {
  createSatrec,
  getSatellitePosition,
  getSatelliteLookAngles,
  latLonAltToCartesian,
} from "../util/satellitePosition";

import { mockSatellites, groundLocations } from "../data/mockData";

function SatelliteGlobe({
  satellites,
  setSatellites,
  onSatelliteSelect,
  selectedSatelliteId,
}) {
  const [orbitTime, setOrbitTime] = useState(new Date());

  const observer = groundLocations[0];

  const baseLayer = useMemo(() => {
    return new ImageryLayer(
      new OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/",
      }),
    );
  }, []);

  const satelliteRecords = useMemo(() => {
    return mockSatellites.map((satellite) => ({
      ...satellite,

      satrec: createSatrec(satellite.tleLine1, satellite.tleLine2),
    }));
  }, []);

  useEffect(() => {
    function updatePositions() {
      const now = new Date();

      const updatedSatellites = satelliteRecords
        .map((satellite) => {
          const position = getSatellitePosition(satellite.satrec, now);

          if (!position) {
            return null;
          }

          const lookAngles = getSatelliteLookAngles(
            satellite.satrec,
            observer,
            now,
          );

          let visibilityStatus = "BELOW HORIZON";

          if (lookAngles) {
            if (lookAngles.elevation >= 10) {
              visibilityStatus = "IN VIEW";
            } else if (lookAngles.elevation > 0) {
              visibilityStatus = "LOW ELEVATION";
            }
          }

          return {
            ...satellite,

            latitude: position.latitude,

            longitude: position.longitude,

            altitude: position.altitude,

            position: Cartesian3.fromDegrees(
              position.longitude,
              position.latitude,
              position.altitude * 1000,
            ),

            azimuth: lookAngles?.azimuth ?? null,

            elevation: lookAngles?.elevation ?? null,

            range: lookAngles?.range ?? null,

            visible: lookAngles ? lookAngles.elevation >= 10 : false,

            visibilityStatus,
          };
        })
        .filter(Boolean);

      setSatellites(updatedSatellites);
    }

    updatePositions();

    const interval = setInterval(updatePositions, 1000);

    return () => clearInterval(interval);
  }, [satelliteRecords, observer, setSatellites]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  const selectedRecord = satelliteRecords.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  const observerPosition = latLonAltToCartesian(
    observer.latitude,
    observer.longitude,
    observer.altitude,
  );

  return (
    <div
      className="cesium-globe-container"
      style={{
        width: "100%",
        height: "650px",
      }}
    >
      <Viewer
        style={{
          width: "100%",
          height: "100%",
        }}
        animation={false}
        timeline={false}
        fullscreenButton={false}
        homeButton
        geocoder={false}
        infoBox={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        baseLayer={baseLayer}
      >
        {groundLocations.map((location) => (
          <GroundLocation key={location.id} location={location} />
        ))}

        {selectedSatellite && (
          <CoverageFootprint
            latitude={selectedSatellite.latitude}
            longitude={selectedSatellite.longitude}
            altitude={selectedSatellite.altitude}
            minimumElevation={10}
          />
        )}

        {selectedRecord && (
          <OrbitTrail satrec={selectedRecord.satrec} currentTime={orbitTime} />
        )}

        {selectedSatellite && (
          <LineOfSight
            start={observerPosition}
            end={selectedSatellite.position}
            visible={selectedSatellite.visible}
          />
        )}

        {satellites.map((satellite) => (
          <Satellite
            key={satellite.noradId}
            satellite={satellite}
            onSelect={onSatelliteSelect}
          />
        ))}
      </Viewer>
    </div>
  );
}

export default SatelliteGlobe;
