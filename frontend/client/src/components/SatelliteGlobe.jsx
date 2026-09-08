import { useEffect, useMemo, useState } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls, Stars } from "@react-three/drei";

import Globe from "./Globe";
import Satellite from "./Satellite";
import OrbitTrail from "./OrbitTrail";
import GroundLocation from "./GroundLocation";
import LineOfSight from "./LineOfSight";
import CoverageFootprint from "./CoverageFootprint";

import {
  createSatrec,
  getSatellitePosition,
  getSatelliteEciPosition,
  getSatelliteLookAngles,
  latLonAltToVector3,
  eciToVector3,
  getEarthRotation,
  earthFixedToInertialVector3,
} from "../util/satellitePosition";

import { mockSatellites, groundLocations } from "../data/mockData";

function SatelliteGlobe({
  satellites,
  setSatellites,
  onSatelliteSelect,
  selectedSatelliteId,
}) {
  const [sceneTime, setSceneTime] = useState(new Date());

  const [orbitTime, setOrbitTime] = useState(new Date());

  const observer = groundLocations[0];

  const satelliteRecords = useMemo(() => {
    return mockSatellites.map((sat) => ({
      ...sat,

      satrec: createSatrec(sat.tleLine1, sat.tleLine2),
    }));
  }, []);

  useEffect(() => {
    function updatePositions() {
      const now = new Date();

      setSceneTime(now);

      const updatedSatellites = satelliteRecords
        .map((sat) => {
          const geodeticPosition = getSatellitePosition(sat.satrec, now);

          const eciPosition = getSatelliteEciPosition(sat.satrec, now);

          if (!geodeticPosition || !eciPosition) {
            return null;
          }

          const lookAngles = getSatelliteLookAngles(sat.satrec, observer, now);

          let visibilityStatus = "BELOW HORIZON";

          if (lookAngles) {
            if (lookAngles.elevation >= 10) {
              visibilityStatus = "IN VIEW";
            } else if (lookAngles.elevation > 0) {
              visibilityStatus = "LOW ELEVATION";
            }
          }

          return {
            ...sat,

            latitude: geodeticPosition.latitude,

            longitude: geodeticPosition.longitude,

            altitude: geodeticPosition.altitude,

            position: eciToVector3(eciPosition),

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
  }, [satelliteRecords, setSatellites, observer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const selectedRecord = satelliteRecords.find(
    (sat) => sat.noradId === selectedSatelliteId,
  );

  const selectedSatellite = satellites.find(
    (sat) => sat.noradId === selectedSatelliteId,
  );

  const earthRotation = getEarthRotation(sceneTime);

  const observerEarthFixedPosition = latLonAltToVector3(
    observer.latitude,
    observer.longitude,
    observer.altitude,
  );

  const observerWorldPosition = earthFixedToInertialVector3(
    observerEarthFixedPosition,
    earthRotation,
  );

  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        background: "black",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 45,
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight position={[5, 3, 5]} intensity={2} />

        <Stars radius={100} depth={50} count={3000} factor={4} fade />

        <group rotation={[0, earthRotation, 0]}>
          <Globe />

          {groundLocations.map((location) => (
            <GroundLocation
              key={location.id}
              name={location.name}
              position={latLonAltToVector3(
                location.latitude,
                location.longitude,
                location.altitude,
              )}
            />
          ))}

          {selectedSatellite && (
            <CoverageFootprint
              latitude={selectedSatellite.latitude}
              longitude={selectedSatellite.longitude}
              altitude={selectedSatellite.altitude}
              minimumElevation={10}
            />
          )}
        </group>

        {selectedRecord && (
          <OrbitTrail satrec={selectedRecord.satrec} currentTime={orbitTime} />
        )}

        {selectedSatellite?.visible && (
          <LineOfSight
            start={observerWorldPosition}
            end={selectedSatellite.position}
          />
        )}

        {satellites.map((sat) => (
          <Satellite
            key={sat.noradId}
            name={sat.name}
            position={sat.position}
            onSelect={() => onSatelliteSelect(sat)}
          />
        ))}

        <OrbitControls enablePan={false} enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

export default SatelliteGlobe;
