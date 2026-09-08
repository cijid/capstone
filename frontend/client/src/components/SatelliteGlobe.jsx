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

import { mockSatellites, groundLocations } from "../data/mockData";

function SatelliteGlobe({
  satellites,
  setSatellites,
  onSatelliteSelect,
  selectedSatelliteId,
}) {
  /*
   * Coverage position is intentionally
   * separate from the live satellite
   * position.
   *
   * Satellites update every second.
   * Coverage updates every 5 seconds.
   */
  const [coverageSatellite, setCoverageSatellite] = useState(null);

  const lastCoverageUpdateRef = useRef(0);

  const observer = groundLocations[0];

  /*
   * Create the map layer once.
   *
   * Adjust these properties to change
   * the visual appearance of the globe.
   */
  const baseLayer = useMemo(() => {
    const provider = new OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/",
    });

    const layer = new ImageryLayer(provider);

    layer.brightness = 0.48;

    layer.contrast = 1.3;

    layer.saturation = 0.35;

    layer.gamma = 0.9;

    return layer;
  }, []);

  /*
   * Build the satellite.js records once.
   *
   * Keeping these objects stable is
   * important because OrbitTrail is
   * memoized based on satrec.
   */
  const satelliteRecords = useMemo(() => {
    return mockSatellites.map((satellite) => ({
      ...satellite,

      satrec: createSatrec(satellite.tleLine1, satellite.tleLine2),
    }));
  }, []);

  /*
   * Propagate satellite positions once
   * per second.
   */
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

            /*
             * Cesium expects altitude
             * in meters.
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
       * Update live satellite positions.
       */
      setSatellites(updatedSatellites);

      /*
       * Coverage geometry is considerably
       * more expensive than moving a point.
       *
       * Only update the footprint every
       * five seconds.
       */
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

    updatePositions();

    const interval = setInterval(updatePositions, 1000);

    return () => clearInterval(interval);
  }, [satelliteRecords, observer, selectedSatelliteId, setSatellites]);

  /*
   * When the user selects a different
   * satellite, reset the coverage timer.
   *
   * This makes the new footprint appear
   * immediately rather than waiting for
   * the previous five-second interval.
   */
  useEffect(() => {
    if (!selectedSatelliteId) {
      setCoverageSatellite(null);

      return;
    }

    const selected = satellites.find(
      (satellite) => satellite.noradId === selectedSatelliteId,
    );

    if (selected) {
      setCoverageSatellite(selected);

      lastCoverageUpdateRef.current = Date.now();
    }
  }, [selectedSatelliteId]);

  /*
   * Current selected satellite.
   *
   * This is the live position and is used
   * for LOS and the details panel.
   */
  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  /*
   * Stable satellite record used by
   * OrbitTrail.
   */
  const selectedRecord = satelliteRecords.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  /*
   * Ground observer position.
   */
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
        {/* Ground Locations */}

        {groundLocations.map((location) => (
          <GroundLocation key={location.id} location={location} />
        ))}

        {/* Coverage Footprint */}

        {coverageSatellite && (
          <CoverageFootprint
            latitude={coverageSatellite.latitude}
            longitude={coverageSatellite.longitude}
            altitude={coverageSatellite.altitude}
            minimumElevation={10}
          />
        )}

        {/* Selected Satellite Orbit */}

        {selectedRecord && <OrbitTrail satrec={selectedRecord.satrec} />}

        {/* Ground-to-Satellite LOS */}

        {selectedSatellite && (
          <LineOfSight
            start={observerPosition}
            end={selectedSatellite.position}
            visible={selectedSatellite.visible}
          />
        )}

        {/* Satellites */}

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
