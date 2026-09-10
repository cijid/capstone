import { useEffect, useMemo, useRef, useState } from "react";

import SatelliteGlobe from "../components/SatelliteGlobe";
import SatelliteList from "../components/SatelliteList";
import SatelliteDetails from "../components/SatelliteDetails";
// import CoverageSummary from "../components/CoverageSummary";
import MissionImpactSummary from "../components/MissionImpactSummaries";

import {
  getLocations,
  getReports,
  getSpaceCapabilities,
  getLocationCapabilityDependencies,
  getAmsatSatellites,
  getOrbitalAssetCapabilities,
} from "../util/apiHelper";

import {
  locationToMapLocation,
  reportToMapReport,
  dependencyToMapDependency,
  orbitalAssetToMapAsset,
  orbitalAssetCapabilityToMapCapability,
  joinReportsToLocations,
  joinCapabilitiesToLocations,
  joinCapabilitiesToOrbitalAssets,
} from "../util/mapData";

import {
  assessLocationCapabilities,
  assessLocationMission,
} from "../util/capabilityAssessment";

import { formatTimeUntil } from "../util/satellitePosition";

import "../styles/spaceCoverage.css";

function SpaceCoverageDashboard() {
  const [satellites, setSatellites] = useState([]);

  const [orbitalAssets, setOrbitalAssets] = useState([]);

  const [groundLocations, setGroundLocations] = useState([]);

  const [selectedSatelliteId, setSelectedSatelliteId] = useState(null);

  const [selectedLocationId, setSelectedLocationId] = useState("location3");

  const [loadingMapData, setLoadingMapData] = useState(true);

  const [mapDataError, setMapDataError] = useState(null);

  const [assessmentSatellites, setAssessmentSatellites] = useState([]);

  const [assessmentTime, setAssessmentTime] = useState(() => new Date());

  const latestSatellitesRef = useRef([]);

  useEffect(() => {
    async function loadMapData() {
      try {
        setLoadingMapData(true);

        setMapDataError(null);

        const [
          locationData,
          reportData,
          spaceCapabilityData,
          dependencyData,
          orbitalAssetData,
          orbitalAssetCapabilityData,
        ] = await Promise.all([
          getLocations(),
          getReports(),
          getSpaceCapabilities(),
          getLocationCapabilityDependencies(),
          getAmsatSatellites(),
          getOrbitalAssetCapabilities(),
        ]);

        const mappedLocations = locationData.map(locationToMapLocation);

        const mappedReports = reportData.map(reportToMapReport);

        const mappedDependencies = dependencyData.map((dependency) =>
          dependencyToMapDependency(dependency, spaceCapabilityData),
        );

        const mappedOrbitalAssets = orbitalAssetData.map(
          orbitalAssetToMapAsset,
        );

        const mappedAssetCapabilities = orbitalAssetCapabilityData.map(
          (relationship) =>
            orbitalAssetCapabilityToMapCapability(
              relationship,
              spaceCapabilityData,
            ),
        );

        const locationsWithReports = joinReportsToLocations(
          mappedLocations,
          mappedReports,
        );

        const completeLocations = joinCapabilitiesToLocations(
          locationsWithReports,
          mappedDependencies,
        );

        const completeOrbitalAssets = joinCapabilitiesToOrbitalAssets(
          mappedOrbitalAssets,
          mappedAssetCapabilities,
        );

        setGroundLocations(completeLocations);

        setOrbitalAssets(completeOrbitalAssets);

        const defaultLocation = completeLocations.find(
          (location) => location.id === "location3",
        );

        if (defaultLocation) {
          setSelectedLocationId(defaultLocation.id);
        } else if (completeLocations.length > 0) {
          setSelectedLocationId(completeLocations[0].id);
        }
      } catch (error) {
        console.error("Failed to load space coverage data:", error);

        setMapDataError(error.message);
      } finally {
        setLoadingMapData(false);
      }
    }

    loadMapData();
  }, []);

  useEffect(() => {
    latestSatellitesRef.current = satellites;

    if (assessmentSatellites.length === 0 && satellites.length > 0) {
      setAssessmentSatellites(satellites);

      setAssessmentTime(new Date());
    }
  }, [satellites, assessmentSatellites.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssessmentSatellites(latestSatellitesRef.current);

      setAssessmentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const observer =
    groundLocations.find((location) => location.id === selectedLocationId) ??
    null;

  const selectedSatellite =
    satellites.find((satellite) => satellite.noradId === selectedSatelliteId) ??
    null;

  const capabilityAssessments = useMemo(() => {
    if (!observer) {
      return [];
    }

    return assessLocationCapabilities(
      observer,
      assessmentSatellites,
      assessmentTime,
    );
  }, [observer, assessmentSatellites, assessmentTime]);

  const missionAssessment = useMemo(() => {
    if (!observer) {
      return null;
    }

    return assessLocationMission(capabilityAssessments);
  }, [observer, capabilityAssessments]);

  function handleSatelliteSelect(satellite) {
    setSelectedSatelliteId(satellite.noradId);
  }

  function handleLocationSelect(location) {
    setSelectedLocationId(location.id);

    setSelectedSatelliteId(null);

    setAssessmentSatellites(latestSatellitesRef.current);

    setAssessmentTime(new Date());
  }

  return (
    <div className="coverage-dashboard">
      <header className="coverage-dashboard-header">
        <div>
          <p className="dashboard-eyebrow">SPACE DOMAIN AWARENESS</p>

          <h1>Space Coverage</h1>

          <p>
            Satellite visibility, capability dependencies, and regional mission
            support assessment
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-indicator" />
          LIVE
        </div>
      </header>

      {observer && (
        <div className="coverage-observer-bar">
          <span>OBSERVER</span>

          <strong>{observer.name}</strong>

          <span>{observer.capabilities?.length ?? 0} capabilities</span>

          <span>{observer.reports?.length ?? 0} reports</span>
        </div>
      )}

      {observer && missionAssessment && (
        <MissionImpactSummary assessment={missionAssessment} />
      )}

      {loadingMapData && (
        <div className="map-data-message">Loading operational data...</div>
      )}

      {mapDataError && (
        <div className="map-data-message map-data-error">
          Unable to load map data: {mapDataError}
        </div>
      )}

      <main className="coverage-dashboard-grid">
        <SatelliteList
          satellites={satellites}
          selectedSatelliteId={selectedSatelliteId}
          onSatelliteSelect={handleSatelliteSelect}
        />

        <section className="globe-panel">
          <SatelliteGlobe
            orbitalAssets={orbitalAssets}
            satellites={satellites}
            setSatellites={setSatellites}
            onSatelliteSelect={handleSatelliteSelect}
            selectedSatelliteId={selectedSatelliteId}
            groundLocations={groundLocations}
            observer={observer}
            onLocationSelect={handleLocationSelect}
          />
        </section>

        <aside className="details-panel">
          <SatelliteDetails satellite={selectedSatellite} />

          {observer && (
            <div className="location-details">
              <p className="panel-label">Ground Location</p>

              <h2>{observer.name}</h2>

              <div className="location-coordinate-grid">
                <div>
                  <span>Latitude</span>

                  <strong>{observer.latitude.toFixed(4)}°</strong>
                </div>

                <div>
                  <span>Longitude</span>

                  <strong>{observer.longitude.toFixed(4)}°</strong>
                </div>
              </div>

              <div className="location-capability-section">
                <h3>Capability Assessment</h3>

                {capabilityAssessments.length === 0 ? (
                  <p>No capability dependencies defined for this location.</p>
                ) : (
                  capabilityAssessments.map(({ dependency, assessment }) => (
                    <div
                      key={dependency.id}
                      className="location-capability-card"
                    >
                      <div className="location-capability-header">
                        <strong>{dependency.name}</strong>

                        <span
                          className={`capability-assessment-status assessment-${assessment.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {assessment.status}
                        </span>
                      </div>

                      <div className="location-capability-meta">
                        <span>
                          {dependency.required ? "Required" : "Supporting"}
                        </span>

                        <span
                          className={`capability-priority priority-${dependency.priority}`}
                        >
                          {dependency.priority}
                        </span>
                      </div>

                      <p className="capability-assessment-reason">
                        {assessment.reason}
                      </p>

                      {assessment.nextCoverage && (
                        <div className="next-coverage">
                          <span>Next Modeled Coverage</span>

                          <strong>
                            {assessment.nextCoverage.satelliteName}
                          </strong>

                          <span>
                            {formatTimeUntil(
                              assessment.nextCoverage.start,
                              assessmentTime,
                            )}
                          </span>

                          <span>
                            {assessment.nextCoverage.start.toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      <div className="capability-assessment-counts">
                        <span>
                          Supporting: {assessment.supportingAssets.length}
                        </span>

                        <span>In View: {assessment.visibleAssets.length}</span>

                        <span>Reports: {assessment.reports.length}</span>
                      </div>

                      <div className="capability-supporting-assets">
                        {assessment.supportingAssets.length === 0 ? (
                          <p>No orbital assets mapped.</p>
                        ) : (
                          assessment.supportingAssets.map((asset) => (
                            <button
                              key={asset.id}
                              type="button"
                              className={`supporting-asset ${
                                asset.visible ? "asset-visible" : ""
                              }`}
                              onClick={() => handleSatelliteSelect(asset)}
                            >
                              <span>{asset.name}</span>

                              <strong>{asset.visibilityStatus}</strong>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="location-report-section">
                <h3>Location Reports</h3>

                {observer.reports?.length === 0 ? (
                  <p>No reports for this location.</p>
                ) : (
                  observer.reports?.map((report) => (
                    <div key={report.id} className="location-report-card">
                      <div className="location-report-header">
                        <strong>{report.name}</strong>

                        <span>Severity {report.severity}</span>
                      </div>

                      {report.capabilityName && <p>{report.capabilityName}</p>}

                      {report.description && <p>{report.description}</p>}

                      {report.recommendedAction && (
                        <p>
                          <strong>Recommended:</strong>{" "}
                          {report.recommendedAction}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* {observer && (
        <CoverageSummary satellites={satellites} observer={observer} />
      )} */}
    </div>
  );
}

export default SpaceCoverageDashboard;
