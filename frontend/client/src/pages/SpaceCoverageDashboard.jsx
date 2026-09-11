import { useEffect, useMemo, useState } from "react";

import SatelliteGlobe from "../components/SatelliteGlobe";
import SatelliteDetails from "../components/SatelliteDetails";

import {
  getLocations,
  getReports,
  getSpaceCapabilities,
  getLocationCapabilityDependencies,
  getOrbitalAssets,
  getOrbitalAssetCapabilities,
} from "../util/apiHelper";

import {
  reportToMapReport,
  locationToMapLocation,
  dependencyToMapDependency,
  orbitalAssetToMapAsset,
  orbitalAssetCapabilityToMapCapability,
  joinReportsToLocations,
  joinCapabilitiesToLocations,
  joinCapabilitiesToOrbitalAssets,
  getSupportingAssetsForLocation,
} from "../util/mapData";

import "../styles/spaceCoverage.css";

function SpaceCoverageDashboard() {
  const [locations, setLocations] = useState([]);

  const [orbitalAssets, setOrbitalAssets] = useState([]);

  const [satellites, setSatellites] = useState([]);

  const [selectedSatelliteId, setSelectedSatelliteId] = useState(null);

  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

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
          getOrbitalAssets(),
          getOrbitalAssetCapabilities(),
        ]);

        const mappedReports = reportData.map(reportToMapReport);

        const mappedLocations = locationData.map(locationToMapLocation);

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

        setLocations(completeLocations);

        setOrbitalAssets(completeOrbitalAssets);

        if (completeLocations.length > 0) {
          setSelectedLocationId(completeLocations[0].id);
        }
      } catch (err) {
        console.error("Failed to load space coverage data:", err);

        setError(err.message ?? "Failed to load space coverage data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedLocation = useMemo(() => {
    return (
      locations.find((location) => location.id === selectedLocationId) ?? null
    );
  }, [locations, selectedLocationId]);

  const observer = useMemo(() => {
    if (!selectedLocation) {
      return null;
    }

    return {
      id: selectedLocation.id,

      name: selectedLocation.name,

      latitude: selectedLocation.latitude,

      longitude: selectedLocation.longitude,

      altitude: selectedLocation.altitude ?? 0,
    };
  }, [selectedLocation]);

  const selectedSatellite = useMemo(() => {
    return (
      satellites.find(
        (satellite) => satellite.noradId === selectedSatelliteId,
      ) ?? null
    );
  }, [satellites, selectedSatelliteId]);

  const supportingAssets = useMemo(() => {
    return getSupportingAssetsForLocation(selectedLocation, orbitalAssets);
  }, [selectedLocation, orbitalAssets]);

  function handleSatelliteSelect(satellite) {
    setSelectedSatelliteId(satellite.noradId);
  }

  function handleLocationSelect(location) {
    setSelectedLocationId(location.id);

    setSelectedSatelliteId(null);
  }

  if (loading) {
    return (
      <div className="coverage-dashboard">
        <div className="coverage-dashboard-header">
          <div>
            <h1>Joint Space Effects Tracker</h1>

            <p>Orbital Coverage</p>
          </div>
        </div>

        <div className="coverage-loading">Loading space coverage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coverage-dashboard">
        <div className="coverage-dashboard-header">
          <div>
            <h1>Joint Space Effects Tracker</h1>

            <p>Orbital Coverage</p>
          </div>
        </div>

        <div className="coverage-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="coverage-dashboard">
      <header className="coverage-dashboard-header">
        <div>
          <h1>Joint Space Effects Tracker</h1>

          <p>Orbital Coverage</p>
        </div>

        <div className="dashboard-status">
          <span className="status-indicator" />
          Live orbital tracking
        </div>
      </header>

      <main className="coverage-dashboard-grid">
        <section className="satellite-list-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Orbital assets</p>

              <h2>Satellites</h2>
            </div>

            <span className="satellite-count">{orbitalAssets.length}</span>
          </div>

          <div className="satellite-list">
            {satellites.map((satellite) => {
              const asset = orbitalAssets.find(
                (orbitalAsset) => orbitalAsset.id === satellite.id,
              );

              const capabilityCount = asset?.capabilities?.length ?? 0;

              return (
                <button
                  key={satellite.id}
                  type="button"
                  className={
                    selectedSatelliteId === satellite.noradId
                      ? "satellite-list-item selected"
                      : "satellite-list-item"
                  }
                  onClick={() => handleSatelliteSelect(satellite)}
                >
                  <span
                    className={
                      satellite.visible
                        ? "satellite-status-dot visible"
                        : "satellite-status-dot not-visible"
                    }
                  />

                  <div>
                    <strong>{satellite.name}</strong>

                    <span>NORAD {satellite.noradId}</span>

                    <span>
                      {capabilityCount} capability
                      {capabilityCount === 1 ? "" : "ies"}
                    </span>
                  </div>

                  <span className="satellite-list-elevation">
                    {satellite.elevation !== null
                      ? `${satellite.elevation.toFixed(1)}°`
                      : "--"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="globe-panel">
          <SatelliteGlobe
            orbitalAssets={orbitalAssets}
            satellites={satellites}
            setSatellites={setSatellites}
            selectedSatelliteId={selectedSatelliteId}
            onSatelliteSelect={handleSatelliteSelect}
            groundLocations={locations}
            observer={observer}
            onLocationSelect={handleLocationSelect}
          />
        </section>

        <section className="details-panel">
          {selectedSatellite ? (
            <SatelliteDetails
              satellite={selectedSatellite}
              orbitalAsset={orbitalAssets.find(
                (asset) => asset.id === selectedSatellite.id,
              )}
              observer={observer}
            />
          ) : (
            <div className="satellite-details empty">
              <h2>Satellite Details</h2>

              <p>Select a satellite to view orbital and capability details.</p>
            </div>
          )}
        </section>
      </main>

      <section className="coverage-summary">
        <div className="panel-header">
          <div>
            <p className="panel-label">Ground location</p>

            <h2>
              {selectedLocation
                ? selectedLocation.name
                : "No Location Selected"}
            </h2>
          </div>
        </div>

        {selectedLocation && (
          <>
            <div>
              <strong>Required Capabilities</strong>

              {selectedLocation.capabilities?.length > 0 ? (
                <ul>
                  {selectedLocation.capabilities.map((capability) => (
                    <li key={capability.id}>{capability.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No capability dependencies defined.</p>
              )}
            </div>

            <div>
              <strong>Potential Orbital Providers</strong>

              {supportingAssets.length > 0 ? (
                <ul>
                  {supportingAssets.map((asset) => (
                    <li key={asset.id}>{asset.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No mapped orbital providers.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SpaceCoverageDashboard;
