import { useEffect, useState } from "react";

import SatelliteGlobe from "../components/SatelliteGlobe";
import SatelliteList from "../components/SatelliteList";
import SatelliteDetails from "../components/SatelliteDetails";
import CoverageSummary from "../components/CoverageSummary";

import { getLocations } from "../util/api";

import { locationToMapLocation } from "../util/mapData";

import "../styles/spaceCoverage.css";

function SpaceCoverageDashboard() {
  /*
   * Live satellite state.
   */
  const [satellites, setSatellites] = useState([]);

  /*
   * Backend ground locations.
   */
  const [groundLocations, setGroundLocations] = useState([]);

  /*
   * Selected satellite.
   */
  const [selectedSatelliteId, setSelectedSatelliteId] = useState(null);

  /*
   * Backend loading state.
   */
  const [loadingLocations, setLoadingLocations] = useState(true);

  /*
   * Backend error state.
   */
  const [locationError, setLocationError] = useState(null);

  /*
   * Load locations from backend
   */
  useEffect(() => {
    async function loadLocations() {
      try {
        setLoadingLocations(true);

        setLocationError(null);

        const data = await getLocations();

        /*
         * Convert database fields into
         * map-friendly fields.
         */
        const mappedLocations = data.map(locationToMapLocation);

        setGroundLocations(mappedLocations);
      } catch (error) {
        console.error("Failed to load locations:", error);

        setLocationError(error.message);
      } finally {
        setLoadingLocations(false);
      }
    }

    loadLocations();
  }, []);

  /*
   * Live selected satellite object.
   */
  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  /*
   * First backend location currently
   * acts as the coverage observer.
   */
  const observer = groundLocations[0] ?? null;

  function handleSatelliteSelect(satellite) {
    setSelectedSatelliteId(satellite.noradId);
  }

  return (
    <div className="coverage-dashboard">
      {/* HEADER */}

      <header className="coverage-dashboard-header">
        <div>
          <p className="dashboard-eyebrow">SPACE DOMAIN AWARENESS</p>

          <h1>Space Coverage</h1>

          <p>Satellite visibility and regional coverage assessment</p>
        </div>

        <div className="dashboard-status">
          <span className="status-indicator" />
          LIVE
        </div>
      </header>

      {/* MAIN DASHBOARD */}

      <main className="coverage-dashboard-grid">
        {/* Satellite List */}

        <SatelliteList
          satellites={satellites}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={handleSatelliteSelect}
        />

        {/* Globe */}

        <section className="globe-panel">
          {loadingLocations && (
            <div className="map-data-message">Loading ground locations...</div>
          )}

          {locationError && (
            <div className="map-data-message map-data-error">
              Unable to load locations: {locationError}
            </div>
          )}

          <SatelliteGlobe
            satellites={satellites}
            setSatellites={setSatellites}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={handleSatelliteSelect}
            groundLocations={groundLocations}
          />
        </section>

        {/* Selected Asset */}

        <aside className="details-panel">
          <SatelliteDetails satellite={selectedSatellite} />
        </aside>
      </main>

      {/* Summary */}

      {observer && (
        <CoverageSummary satellites={satellites} observer={observer} />
      )}
    </div>
  );
}

export default SpaceCoverageDashboard;
