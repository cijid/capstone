import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import AreaMap from "../components/AreaMap";

import { getReports } from "../services/api";

import { transformReport } from "../utils/backendData";

import "../styles/army.css";

function ArmyDashboard() {
  const navigate = useNavigate();

  const overviewRef = useRef(null);
  const effectsRef = useRef(null);
  const mapRef = useRef(null);
  const paceRef = useRef(null);

  const [effects, setEffects] = useState([]);

  const [selectedEffectId, setSelectedEffectId] = useState("");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    async function loadArmyData() {
      try {
        setLoading(true);
        setApiError("");

        const reportData = await getReports();

        const transformedReports = reportData.map(transformReport);

        setEffects(transformedReports);

        const firstActiveEffect = transformedReports.find(
          (effect) => effect.status === "Active",
        );

        if (firstActiveEffect) {
          setSelectedEffectId(firstActiveEffect.id);
        }
      } catch (error) {
        console.error("Unable to load Army dashboard data:", error);

        setApiError("Unable to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    }

    loadArmyData();
  }, []);

  const capabilityCategories = [
    {
      id: "PNT",
      name: "PNT",
    },
    {
      id: "SATCOM",
      name: "SATCOM",
    },
    {
      id: "MW-MT",
      name: "MW/MT",
    },
  ];

  const activeEffects = effects.filter((effect) => effect.status === "Active");

  const calculatedCapabilities = capabilityCategories.map((capability) => {
    const matchingActiveEffects = activeEffects.filter(
      (effect) => effect.capabilityCategory === capability.name,
    );

    return {
      ...capability,

      activeEffects: matchingActiveEffects.length,

      status: matchingActiveEffects.length > 0 ? "Degraded" : "Available",
    };
  });

  const selectedEffect =
    activeEffects.find((effect) => effect.id === selectedEffectId) ||
    activeEffects[0];

  function scrollToSection(ref, section) {
    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleEffectSelection(event) {
    setSelectedEffectId(event.target.value);

    setActiveSection("effects");
  }

  return (
    <main className="army-dashboard">
      <aside className="army-sidebar">
        <p className="army-sidebar-title">ARMY VIEW</p>

        <nav className="army-sidebar-nav">
          <button
            className={`sidebar-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => scrollToSection(overviewRef, "overview")}
          >
            ▣ Overview
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "map" ? "active" : ""
            }`}
            onClick={() => scrollToSection(mapRef, "map")}
          >
            ⌖ Map
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "effects" ? "active" : ""
            }`}
            onClick={() => scrollToSection(effectsRef, "effects")}
          >
            ✦ Effects
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "pace" ? "active" : ""
            }`}
            onClick={() => scrollToSection(paceRef, "pace")}
          >
            ▤ PACE Guidance
          </button>

          <button
            className="sidebar-item"
            onClick={() => window.alert("Settings are not available yet.")}
          >
            ⚙ Settings
          </button>
        </nav>
      </aside>

      <div className="army-workspace">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Army Operational View</p>

            <h1>Joint Space Support Tracker</h1>
          </div>

          <button onClick={() => navigate("/")}>← Home</button>
        </header>

        <section className="dashboard-content" ref={overviewRef}>
          <div className="dashboard-title">
            <h2>Capability Status</h2>

            <p>Current space-enabled capability availability.</p>
          </div>

          {apiError && (
            <div className="empty-effects">
              <h3>Backend Connection Error</h3>

              <p>{apiError}</p>
            </div>
          )}

          {loading && (
            <div className="empty-effects">
              <h3>Loading Operational Data</h3>

              <p>Retrieving capability and effect information.</p>
            </div>
          )}

          {!loading && !apiError && (
            <>
              <div className="capability-grid">
                {calculatedCapabilities.map((capability) => (
                  <CapabilityCard
                    key={capability.id}
                    capability={capability}
                    isSelected={false}
                    onClick={() => {}}
                  />
                ))}
              </div>

              <div className="army-effect-selector" ref={effectsRef}>
                <label htmlFor="army-effect-select">Active Effect</label>

                {activeEffects.length > 0 ? (
                  <select
                    id="army-effect-select"
                    value={selectedEffect?.id || ""}
                    onChange={handleEffectSelection}
                  >
                    {activeEffects.map((effect) => (
                      <option key={effect.id} value={effect.id}>
                        {effect.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>No active effects are currently available.</p>
                )}
              </div>

              <div className="army-bottom-row">
                {selectedEffect ? (
                  <section className="effect-panel">
                    <p className="eyebrow">Active Space Effect</p>

                    <h2>{selectedEffect.title}</h2>

                    <p>
                      <strong>Capability:</strong>{" "}
                      {selectedEffect.capabilityCategory}
                    </p>

                    <p>
                      <strong>Location:</strong> {selectedEffect.location}
                    </p>

                    <p>
                      <strong>Confidence:</strong> {selectedEffect.confidence}%
                    </p>

                    <p>
                      <strong>Severity:</strong> {selectedEffect.severity}
                    </p>

                    <hr />

                    <h3>Mission Impact</h3>

                    <p>{selectedEffect.description}</p>

                    <div ref={paceRef}>
                      <h3>Recommended Action</h3>

                      <p>
                        {selectedEffect.recommendedAction ||
                          "No recommended action has been provided."}
                      </p>

                      <button onClick={() => scrollToSection(paceRef, "pace")}>
                        View PACE Guidance →
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="effect-panel">
                    <p className="eyebrow">Active Space Effect</p>

                    <h2>No Active Effects</h2>

                    <p>
                      There are currently no active space effects impacting
                      supported forces.
                    </p>
                  </section>
                )}

                <section className="map-panel" ref={mapRef}>
                  <h2>Area of Effect</h2>

                  <AreaMap location={selectedEffect?.locationData} />
                </section>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default ArmyDashboard;
