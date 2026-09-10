import { useEffect, useMemo, useRef, useState } from "react";

import { Viewer } from "resium";
import { Cartesian3 } from "cesium";

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

const EMPTY_ARRAY = [];

function SatelliteGlobe({
  orbitalAssets,
  satellites,
  setSatellites,
  onSatelliteSelect,
  selectedSatelliteId,
  groundLocations,
  observer,
  onLocationSelect,
}) {
  const [coverageSatellite, setCoverageSatellite] = useState(null);

  const lastCoverageUpdateRef = useRef(0);

  const assets = orbitalAssets ?? EMPTY_ARRAY;

  const locations = groundLocations ?? EMPTY_ARRAY;

  const satelliteRecords = useMemo(() => {
    return assets
      .filter((asset) => asset.active && asset.tleLine1 && asset.tleLine2)
      .map((asset) => ({
        ...asset,
        satrec: createSatrec(asset.tleLine1, asset.tleLine2),
      }));
  }, [assets]);

  useEffect(() => {
    setCoverageSatellite(null);
    lastCoverageUpdateRef.current = 0;
  }, [selectedSatelliteId]);

  useEffect(() => {
    if (satelliteRecords.length === 0) {
      setSatellites([]);
      return;
    }

    function updatePositions() {
      const now = new Date();

      const updatedSatellites = satelliteRecords
        .map((satellite) => {
          const position = getSatellitePosition(satellite.satrec, now);

          if (!position) {
            return null;
          }

          const lookAngles = observer
            ? getSatelliteLookAngles(satellite.satrec, observer, now)
            : null;

          let visibilityStatus = "NO OBSERVER";

          if (lookAngles) {
            if (lookAngles.elevation >= 10) {
              visibilityStatus = "IN VIEW";
            } else if (lookAngles.elevation > 0) {
              visibilityStatus = "LOW ELEVATION";
            } else {
              visibilityStatus = "BELOW HORIZON";
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

      if (!selectedSatelliteId) {
        return;
      }

      const nowMs = Date.now();

      if (nowMs - lastCoverageUpdateRef.current < 5000) {
        return;
      }

      const selected = updatedSatellites.find(
        (satellite) => satellite.noradId === selectedSatelliteId,
      );

      if (selected) {
        setCoverageSatellite(selected);

        lastCoverageUpdateRef.current = nowMs;
      }
    }

    updatePositions();

    const interval = setInterval(updatePositions, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [satelliteRecords, observer, selectedSatelliteId, setSatellites]);

  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  const selectedRecord = satelliteRecords.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  const observerPosition = observer
    ? latLonAltToCartesian(
        observer.latitude,
        observer.longitude,
        observer.altitude ?? 0,
      )
    : null;

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
      >
        {locations.map((location) => (
          <GroundLocation
            key={`ground-${location.id}`}
            location={location}
            selected={observer?.id === location.id}
            onSelect={onLocationSelect}
          />
        ))}

        {coverageSatellite && (
          <CoverageFootprint
            key={`coverage-${coverageSatellite.id}`}
            satelliteId={coverageSatellite.id}
            latitude={coverageSatellite.latitude}
            longitude={coverageSatellite.longitude}
            altitude={coverageSatellite.altitude}
            minimumElevation={10}
          />
        )}

        {selectedRecord && (
          <OrbitTrail
            key={`orbit-${selectedRecord.id}`}
            satrec={selectedRecord.satrec}
          />
        )}

        {selectedSatellite && observerPosition && (
          <LineOfSight
            key={`los-${observer.id}-${selectedSatellite.id}`}
            start={observerPosition}
            end={selectedSatellite.position}
            visible={selectedSatellite.visible}
          />
        )}

        {satellites.map((satellite) => (
          <Satellite
            key={`satellite-${satellite.id}`}
            satellite={satellite}
            onSelect={onSatelliteSelect}
          />
        ))}
      </Viewer>
    </div>
  );
}

export default SatelliteGlobe;
