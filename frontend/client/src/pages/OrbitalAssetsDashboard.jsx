import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getCapabilities,
  getOrbitalAssets,
  getOrbitalAssetCapabilities,
  createOrbitalAssetCapability,
  deleteOrbitalAssetCapability,
} from "../services/api";

import "../styles/spaceForce.css";

function OrbitalAssetsPage() {
  const navigate = useNavigate();

  const [capabilities, setCapabilities] = useState([]);

  const [orbitalAssets, setOrbitalAssets] = useState([]);

  const [orbitalAssetCapabilities, setOrbitalAssetCapabilities] = useState([]);

  const [savingOrbitalAssignment, setSavingOrbitalAssignment] = useState("");

  const [loading, setLoading] = useState(true);

  const [apiError, setApiError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setApiError("");

        const [capabilityData, orbitalAssetData, orbitalAssetCapabilityData] =
          await Promise.all([
            getCapabilities(),
            getOrbitalAssets(),
            getOrbitalAssetCapabilities(),
          ]);

        setCapabilities(capabilityData);

        setOrbitalAssets(orbitalAssetData);

        setOrbitalAssetCapabilities(orbitalAssetCapabilityData);
      } catch (error) {
        console.error("Unable to load orbital asset data:", error);

        setApiError("Unable to load orbital asset provider data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function getCapabilityLabel(capability) {
    return (
      capability?.name ??
      capability?.category ??
      capability?.id ??
      "Unknown Capability"
    );
  }

  function getAssetAssignments(assetId) {
    return orbitalAssetCapabilities.filter(
      (assignment) => assignment.orbital_asset_id === assetId,
    );
  }

  function getAssignment(assetId, capabilityId) {
    return orbitalAssetCapabilities.find(
      (assignment) =>
        assignment.orbital_asset_id === assetId &&
        assignment.space_capability_id === capabilityId,
    );
  }

  async function refreshOrbitalAssetCapabilities() {
    const data = await getOrbitalAssetCapabilities();

    setOrbitalAssetCapabilities(data);
  }

  async function handleToggleOrbitalCapability(assetId, capabilityId) {
    const assignment = getAssignment(assetId, capabilityId);

    const operationKey = `${assetId}:${capabilityId}`;

    try {
      setSavingOrbitalAssignment(operationKey);

      if (assignment) {
        await deleteOrbitalAssetCapability(assignment.id);
      } else {
        await createOrbitalAssetCapability({
          orbital_asset_id: assetId,
          space_capability_id: capabilityId,
        });
      }

      await refreshOrbitalAssetCapabilities();
    } catch (error) {
      console.error("Unable to update orbital asset capability:", error);

      window.alert(
        `Unable to update orbital asset capability: ${error.message}`,
      );
    } finally {
      setSavingOrbitalAssignment("");
    }
  }

  return (
    <div className="sf-dashboard">
      <aside className="sf-sidebar">
        <p className="sf-sidebar-title">SPACE FORCE VIEW</p>

        <nav className="sf-sidebar-nav">
          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-force")}
          >
            ▣ Overview
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-force")}
          >
            ◈ Capabilities
          </button>

          <button className="sf-sidebar-item active">◉ Orbital Assets</button>

          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-force")}
          >
            ✦ Effects
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-coverage")}
          >
            ◎ Space Coverage
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => window.alert("Settings are not available yet.")}
          >
            ⚙ Settings
          </button>
        </nav>
      </aside>

      <div className="sf-workspace">
        <header className="sf-header">
          <div>
            <p className="sf-header-label">Space Force Administrative View</p>

            <h1>Orbital Asset Providers</h1>
          </div>

          <div className="sf-header-actions">
            <button
              className="sf-home-button"
              onClick={() => navigate("/space-force")}
            >
              ← Dashboard
            </button>
          </div>
        </header>

        <main className="sf-content">
          <section className="sf-page-heading">
            <div>
              <p className="section-label">PROVIDER MANAGEMENT</p>

              <h2>Orbital Asset Capabilities</h2>

              <p>
                Define which modeled space capabilities each orbital asset can
                potentially provide.
              </p>
            </div>
          </section>

          {apiError && (
            <div className="empty-effects">
              <h3>Backend Connection Error</h3>

              <p>{apiError}</p>
            </div>
          )}

          {loading && (
            <div className="empty-effects">
              <h3>Loading Orbital Assets</h3>

              <p>Retrieving orbital assets and capability assignments.</p>
            </div>
          )}

          {!loading && !apiError && (
            <section className="sf-section">
              <div className="section-heading">
                <div>
                  <h2>Provider Assignments</h2>

                  <p className="current-filter">
                    Select the capabilities each orbital asset is modeled to
                    support.
                  </p>
                </div>

                <span>
                  {orbitalAssetCapabilities.length}{" "}
                  {orbitalAssetCapabilities.length === 1
                    ? "Assignment"
                    : "Assignments"}
                </span>
              </div>

              <div className="orbital-provider-grid">
                {orbitalAssets.map((asset) => {
                  const assignments = getAssetAssignments(asset.id);

                  return (
                    <article className="orbital-provider-card" key={asset.id}>
                      <div className="orbital-provider-header">
                        <div>
                          <p className="section-label">ORBITAL ASSET</p>

                          <h3>{asset.name}</h3>

                          <p>NORAD {asset.norad_id}</p>
                        </div>

                        <span
                          className={`orbital-provider-status ${
                            asset.tle_current ? "current" : "stored"
                          }`}
                        >
                          {asset.tle_current ? "Live TLE" : "Stored TLE"}
                        </span>
                      </div>

                      <div className="orbital-provider-capabilities">
                        {capabilities.map((capability) => {
                          const assignment = getAssignment(
                            asset.id,
                            capability.id,
                          );

                          const operationKey = `${asset.id}:${capability.id}`;

                          const isSaving =
                            savingOrbitalAssignment === operationKey;

                          return (
                            <label
                              className={`orbital-capability-option ${
                                assignment ? "assigned" : ""
                              }`}
                              key={capability.id}
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(assignment)}
                                disabled={isSaving}
                                onChange={() =>
                                  handleToggleOrbitalCapability(
                                    asset.id,
                                    capability.id,
                                  )
                                }
                              />

                              <span>{getCapabilityLabel(capability)}</span>

                              {isSaving && <small>Saving...</small>}
                            </label>
                          );
                        })}
                      </div>

                      <div className="orbital-provider-footer">
                        {assignments.length > 0
                          ? `${assignments.length} ${
                              assignments.length === 1
                                ? "capability"
                                : "capabilities"
                            } assigned`
                          : "No capabilities assigned"}
                      </div>
                    </article>
                  );
                })}
              </div>

              {orbitalAssets.length === 0 && (
                <div className="empty-effects">
                  <h3>No Orbital Assets</h3>

                  <p>No active orbital assets were returned by the backend.</p>
                </div>
              )}

              <p className="orbital-provider-note">
                These capability assignments are modeled provider relationships
                for the application. Current geometric visibility is calculated
                separately on the Space Coverage page.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default OrbitalAssetsPage;
