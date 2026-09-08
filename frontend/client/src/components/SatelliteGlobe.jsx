import { useEffect, useMemo, useRef, useState } from "react";

import { Viewer } from "resium";

import { Cartesian3, ImageryLayer, OpenStreetMapImageryProvider } from "cesium";

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

import { mockSatellites } from "../data/mockData";

function SatelliteGlobe({
  satellites,
  setSatellites,
  onSatelliteSelect,
  selectedSatelliteId,
  groundLocations = [],
}) {
  const [coverageSatellite, setCoverageSatellite] = useState(null);

  const lastCoverageUpdateRef = useRef(0);

  const observer = groundLocations[0] ?? null;

  /*
   * Current globe imagery.
   *
   */
  const baseLayer = useMemo(() => {
    const provider = new OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/",
    });

    return new ImageryLayer(provider);
  }, []);

  /*
   * Convert TLEs into stable satellite.js
   * records once.
   */
  const satelliteRecords = useMemo(() => {
    return mockSatellites.map((satellite) => ({
      ...satellite,

      satrec: createSatrec(satellite.tleLine1, satellite.tleLine2),
    }));
  }, []);

  /*
   * Reset coverage whenever the user
   * selects a different satellite.
   */
  useEffect(() => {
    setCoverageSatellite(null);

    lastCoverageUpdateRef.current = 0;
  }, [selectedSatelliteId]);

  /*
   * Propagate satellites every second.
   */
  useEffect(() => {
    /*
     * error catch for entries without observer
     */
    if (!observer) {
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

            /*
             * converts meters to km
             */
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

      /*
       * Satellite markers update once per second.
       */
      setSatellites(updatedSatellites);

      const nowMs = Date.now();

      if (
        selectedSatelliteId &&
        nowMs - lastCoverageUpdateRef.current >= 5000
      ) {
        const selected = updatedSatellites.find(
          (satellite) => satellite.noradId === selectedSatelliteId,
        );

        if (selected) {
          setCoverageSatellite(selected);

          lastCoverageUpdateRef.current = nowMs;
        }
      }
    }

    /*
     * Populate satellites immediately
     */
    updatePositions();

    const interval = setInterval(updatePositions, 1000);

    return () => clearInterval(interval);
  }, [satelliteRecords, observer, selectedSatelliteId, setSatellites]);

  /*
   * Live selected satellite.
   */
  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  /*
   * OrbitTrail receives the unchanged
   * satrec instead of the live satellite
   * object so it doesn't blink.
   */
  const selectedRecord = satelliteRecords.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  /*
   * backend observer
   */
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
        baseLayer={baseLayer}
      >
        {/* Backend ground locations */}

        {groundLocations.map((location) => (
          <GroundLocation key={location.id} location={location} />
        ))}

        {/* Selected satellite coverage */}

        {coverageSatellite && (
          <CoverageFootprint
            latitude={coverageSatellite.latitude}
            longitude={coverageSatellite.longitude}
            altitude={coverageSatellite.altitude}
            minimumElevation={10}
          />
        )}

        {/* Selected satellite orbit */}

        {selectedRecord && <OrbitTrail satrec={selectedRecord.satrec} />}

        {/* Ground-to-satellite LOS */}

        {selectedSatellite && observerPosition && (
          <LineOfSight
            start={observerPosition}
            end={selectedSatellite.position}
            visible={selectedSatellite.visible}
          />
        )}

        {/* Live satellite markers */}

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
