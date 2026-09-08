import { useState } from "react";

import SatelliteGlobe from "../components/SatelliteGlobe";
import SatelliteList from "../components/SatelliteList";
import SatelliteDetails from "../components/SatelliteDetails";
import CoverageSummary from "../components/CoverageSummary";

import { groundLocations } from "../data/mockData";

import "../styles/spaceCoverage.css";

function SpaceCoverageDashboard() {
  const [satellites, setSatellites] = useState([]);

  const [selectedSatelliteId, setSelectedSatelliteId] = useState(null);

  const selectedSatellite = satellites.find(
    (satellite) => satellite.noradId === selectedSatelliteId,
  );

  const observer = groundLocations[0];

  function handleSatelliteSelect(satellite) {
    setSelectedSatelliteId(satellite.noradId);
  }

  return (
    <div className="coverage-dashboard">
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

      <main className="coverage-dashboard-grid">
        <SatelliteList
          satellites={satellites}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={handleSatelliteSelect}
        />

        <section className="globe-panel">
          <SatelliteGlobe
            satellites={satellites}
            setSatellites={setSatellites}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={handleSatelliteSelect}
          />
        </section>

        <aside className="details-panel">
          <SatelliteDetails satellite={selectedSatellite} />
        </aside>
      </main>

      <CoverageSummary satellites={satellites} observer={observer} />
    </div>
  );
}

export default SpaceCoverageDashboard;
