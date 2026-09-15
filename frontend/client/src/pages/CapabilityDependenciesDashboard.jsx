import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getCapabilities,
  getLocations,
  getLocationCapabilityDependencies,
  createLocationCapabilityDependency,
  deleteLocationCapabilityDependency,
} from "../services/api";

import "../styles/spaceForce.css";

function CapabilityDependenciesDashboard() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);

  const [capabilities, setCapabilities] = useState([]);

  const [dependencies, setDependencies] = useState([]);

  const [selectedLocationId, setSelectedLocationId] = useState("");

  const [selectedCapabilityId, setSelectedCapabilityId] = useState("");

  const [required, setRequired] = useState(true);

  const [priority, setPriority] = useState("normal");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setApiError("");

      const [locationData, capabilityData, dependencyData] = await Promise.all([
        getLocations(),
        getCapabilities(),
        getLocationCapabilityDependencies(),
      ]);

      setLocations(locationData);

      setCapabilities(capabilityData);

      setDependencies(dependencyData);
    } catch (error) {
      console.error("Unable to load capability dependencies:", error);

      setApiError("Unable to load capability dependency data.");
    } finally {
      setLoading(false);
    }
  }

  function getLocationName(locationId) {
    const location = locations.find((item) => item.id === locationId);

    return location?.name ?? locationId;
  }

  function getCapabilityName(capabilityId) {
    const capability = capabilities.find((item) => item.id === capabilityId);

    return capability?.name ?? capabilityId;
  }

  function dependencyExists(locationId, capabilityId) {
    return dependencies.some(
      (dependency) =>
        dependency.location_id === locationId &&
        dependency.space_capability_id === capabilityId,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedLocationId || !selectedCapabilityId) {
      window.alert("Select both a location and capability.");

      return;
    }

    if (dependencyExists(selectedLocationId, selectedCapabilityId)) {
      window.alert(
        "That capability dependency already exists for this location.",
      );

      return;
    }

    try {
      setSaving(true);

      await createLocationCapabilityDependency({
        location_id: selectedLocationId,

        space_capability_id: selectedCapabilityId,

        required,

        priority,
      });

      const updatedDependencies = await getLocationCapabilityDependencies();

      setDependencies(updatedDependencies);

      setSelectedCapabilityId("");

      setRequired(true);

      setPriority("normal");
    } catch (error) {
      console.error("Unable to create capability dependency:", error);

      window.alert(`Unable to create capability dependency: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(dependency) {
    const locationName = getLocationName(dependency.location_id);

    const capabilityName = getCapabilityName(dependency.space_capability_id);

    const confirmed = window.confirm(
      `Remove ${capabilityName} from ${locationName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLocationCapabilityDependency(dependency.id);

      setDependencies((currentDependencies) =>
        currentDependencies.filter((item) => item.id !== dependency.id),
      );
    } catch (error) {
      console.error("Unable to delete capability dependency:", error);

      window.alert(`Unable to delete capability dependency: ${error.message}`);
    }
  }

  const sortedDependencies = [...dependencies].sort((a, b) => {
    const locationA = getLocationName(a.location_id);

    const locationB = getLocationName(b.location_id);

    return locationA.localeCompare(locationB);
  });

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

          <button className="sf-sidebar-item active">
            ◈ Capability Dependencies
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-force/orbital-assets")}
          >
            ◉ Orbital Assets
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => navigate("/space-coverage")}
          >
            ◎ Space Coverage
          </button>

          <button className="sf-sidebar-item" onClick={() => navigate("/")}>
            ← Home
          </button>
        </nav>
      </aside>

      <div className="sf-workspace">
        <header className="sf-header">
          <div>
            <p className="sf-header-label">Space Force Administrative View</p>

            <h1>Capability Dependencies</h1>
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
              <p className="section-label">DEPENDENCY MANAGEMENT</p>

              <h2>Location Requirements</h2>

              <p>
                Define which space-enabled capabilities are required at each
                supported location.
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
              <h3>Loading Dependencies</h3>

              <p>Retrieving locations, capabilities, and dependency data.</p>
            </div>
          )}

          {!loading && !apiError && (
            <>
              <section className="sf-section">
                <div className="section-heading">
                  <div>
                    <h2>Add Dependency</h2>

                    <p className="current-filter">
                      Define a capability required by a location.
                    </p>
                  </div>
                </div>

                <form className="dependency-form" onSubmit={handleSubmit}>
                  <label>
                    Location
                    <select
                      value={selectedLocationId}
                      onChange={(event) =>
                        setSelectedLocationId(event.target.value)
                      }
                    >
                      <option value="">Select Location</option>

                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Capability
                    <select
                      value={selectedCapabilityId}
                      onChange={(event) =>
                        setSelectedCapabilityId(event.target.value)
                      }
                    >
                      <option value="">Select Capability</option>

                      {capabilities.map((capability) => (
                        <option key={capability.id} value={capability.id}>
                          {capability.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Priority
                    <select
                      value={priority}
                      onChange={(event) => setPriority(event.target.value)}
                    >
                      <option value="low">Low</option>

                      <option value="normal">Normal</option>

                      <option value="high">High</option>

                      <option value="critical">Critical</option>
                    </select>
                  </label>

                  <label className="dependency-required-option">
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(event) => setRequired(event.target.checked)}
                    />
                    Required Capability
                  </label>

                  <button
                    type="submit"
                    className="sf-home-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Add Dependency"}
                  </button>
                </form>
              </section>

              <section className="sf-section">
                <div className="section-heading">
                  <div>
                    <h2>Current Dependencies</h2>

                    <p className="current-filter">
                      Current modeled capability requirements by location.
                    </p>
                  </div>

                  <span>
                    {dependencies.length}{" "}
                    {dependencies.length === 1 ? "Dependency" : "Dependencies"}
                  </span>
                </div>

                <div className="dependency-list">
                  {sortedDependencies.map((dependency) => (
                    <article className="dependency-card" key={dependency.id}>
                      <div>
                        <p className="section-label">LOCATION</p>

                        <h3>{getLocationName(dependency.location_id)}</h3>
                      </div>

                      <div>
                        <p className="section-label">CAPABILITY</p>

                        <strong>
                          {getCapabilityName(dependency.space_capability_id)}
                        </strong>
                      </div>

                      <div>
                        <p className="section-label">PRIORITY</p>

                        <strong>
                          {String(
                            dependency.priority ?? "normal",
                          ).toUpperCase()}
                        </strong>
                      </div>

                      <div>
                        <p className="section-label">REQUIRED</p>

                        <strong>{dependency.required ? "YES" : "NO"}</strong>
                      </div>

                      <button
                        type="button"
                        className="dependency-delete-button"
                        onClick={() => handleDelete(dependency)}
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>

                {dependencies.length === 0 && (
                  <div className="empty-effects">
                    <h3>No Capability Dependencies</h3>

                    <p>
                      Add a capability requirement to a location using the form
                      above.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default CapabilityDependenciesDashboard;
