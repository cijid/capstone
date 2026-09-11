import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import AreaMap from "../components/AreaMap";

import {
  getReports,
} from "../services/api";

import {
  transformReport,
} from "../utils/backendData";

import "../styles/army.css";

function ArmyDashboard() {
  const navigate =
    useNavigate();

  const overviewRef =
    useRef(null);

  const effectsRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const paceRef =
    useRef(null);

  const [
    effects,
    setEffects,
  ] = useState([]);

  const [
    selectedEffectId,
    setSelectedEffectId,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    apiError,
    setApiError,
  ] = useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState(
    "overview"
  );

  useEffect(() => {
    async function loadArmyData() {
      try {
        setLoading(true);
        setApiError("");

        const reportData =
          await getReports();

        const transformedReports =
          reportData.map(
            transformReport
          );

        setEffects(
          transformedReports
        );

        const firstActiveEffect =
          transformedReports.find(
            (effect) =>
              effect.status ===
              "Active"
          );

        if (
          firstActiveEffect
        ) {
          setSelectedEffectId(
            firstActiveEffect.id
          );
        } else if (
          transformedReports.length >
          0
        ) {
          setSelectedEffectId(
            transformedReports[0]
              .id
          );
        }
      } catch (error) {
        console.error(
          "Unable to load Army dashboard data:",
          error
        );

        setApiError(
          "Unable to connect to the backend API."
        );
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

  const activeEffects =
    effects.filter(
      (effect) =>
        effect.status ===
        "Active"
    );

  const calculatedCapabilities =
    capabilityCategories.map(
      (capability) => {
        const matchingActiveEffects =
          activeEffects.filter(
            (effect) =>
              effect.capabilityCategory ===
              capability.name
          );

        return {
          ...capability,

          activeEffects:
            matchingActiveEffects.length,

          status:
            matchingActiveEffects.length >
            0
              ? "Degraded"
              : "Available",
        };
      }
    );

  const selectedEffect =
    effects.find(
      (effect) =>
        effect.id ===
        selectedEffectId
    ) ||
    effects[0] ||
    null;

  const degradationLocations =
    activeEffects
      .filter(
        (effect) =>
          effect.locationData
      )
      .map((effect) => ({
        ...effect.locationData,

        effectTitle:
          effect.title,

        capability:
          effect.capabilityCategory,

        severity:
          effect.severity,

        confidence:
          effect.confidence,
      }));

  function scrollToSection(
    ref,
    section
  ) {
    setActiveSection(
      section
    );

    ref.current?.scrollIntoView(
      {
        behavior: "smooth",
        block: "start",
      }
    );
  }

  function handleEffectSelection(
    event
  ) {
    setSelectedEffectId(
      event.target.value
    );

    setActiveSection(
      "effects"
    );
  }

  function formatDateTime(
    value
  ) {
    if (!value) {
      return "Not provided";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString();
  }

  return (
    <main className="army-dashboard">
      <aside className="army-sidebar">
        <p className="army-sidebar-title">
          ARMY VIEW
        </p>

        <nav className="army-sidebar-nav">
          <button
            className={`sidebar-item ${
              activeSection ===
              "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                overviewRef,
                "overview"
              )
            }
          >
            ▣ Overview
          </button>

          <button
            className={`sidebar-item ${
              activeSection ===
              "effects"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                effectsRef,
                "effects"
              )
            }
          >
            ✦ Effects
          </button>

          <button
            className={`sidebar-item ${
              activeSection ===
              "map"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                mapRef,
                "map"
              )
            }
          >
            ⌖ Map
          </button>

          <button
            className={`sidebar-item ${
              activeSection ===
              "pace"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                paceRef,
                "pace"
              )
            }
          >
            ▤ PACE Guidance
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              window.alert(
                "Settings are not available yet."
              )
            }
          >
            ⚙ Settings
          </button>
        </nav>
      </aside>

      <div className="army-workspace">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              Army Operational
              View
            </p>

            <h1>
              Joint Space
              Support Tracker
            </h1>
          </div>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            ← Home
          </button>
        </header>

        <section
          className="dashboard-content"
          ref={overviewRef}
        >
          <div className="dashboard-title">
            <h2>
              Capability Status
            </h2>

            <p>
              Current
              space-enabled
              capability
              availability.
            </p>
          </div>

          {apiError && (
            <div className="empty-effects">
              <h3>
                Backend
                Connection
                Error
              </h3>

              <p>
                {apiError}
              </p>
            </div>
          )}

          {loading && (
            <div className="empty-effects">
              <h3>
                Loading
                Operational Data
              </h3>

              <p>
                Retrieving
                capability and
                effect
                information.
              </p>
            </div>
          )}

          {!loading &&
            !apiError && (
              <>
                <div className="capability-grid">
                  {calculatedCapabilities.map(
                    (
                      capability
                    ) => (
                      <CapabilityCard
                        key={
                          capability.id
                        }
                        capability={
                          capability
                        }
                        isSelected={
                          false
                        }
                        onClick={() =>
                          {}
                        }
                      />
                    )
                  )}
                </div>

                <section
                  ref={
                    effectsRef
                  }
                  className="army-effects-section"
                >
                  <div className="dashboard-title">
                    <h2>
                      Effect
                      Reports
                    </h2>

                    <p>
                      View current
                      and historical
                      space effect
                      reports.
                    </p>
                  </div>

                  <div className="army-effect-selector">
                    <label htmlFor="army-effect-select">
                      Effect Report
                    </label>

                    {effects.length >
                    0 ? (
                      <select
                        id="army-effect-select"
                        value={
                          selectedEffect?.id ||
                          ""
                        }
                        onChange={
                          handleEffectSelection
                        }
                      >
                        {effects.map(
                          (
                            effect
                          ) => (
                            <option
                              key={
                                effect.id
                              }
                              value={
                                effect.id
                              }
                            >
                              {
                                effect.title
                              }{" "}
                              -{" "}
                              {
                                effect.status
                              }
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <p>
                        No effect
                        reports are
                        currently
                        available.
                      </p>
                    )}
                  </div>

                  <div className="army-bottom-row">
                    {selectedEffect ? (
                      <section className="effect-panel">
                        <p className="eyebrow">
                          Space Effect
                          Report
                        </p>

                        <h2>
                          {
                            selectedEffect.title
                          }
                        </h2>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}
                          {
                            selectedEffect.status
                          }
                        </p>

                        <p>
                          <strong>
                            Capability:
                          </strong>{" "}
                          {
                            selectedEffect.capabilityCategory
                          }
                        </p>

                        <p>
                          <strong>
                            Location:
                          </strong>{" "}
                          {
                            selectedEffect.location
                          }
                        </p>

                        <p>
                          <strong>
                            Confidence:
                          </strong>{" "}
                          {
                            selectedEffect.confidence
                          }
                          %
                        </p>

                        <p>
                          <strong>
                            Severity:
                          </strong>{" "}
                          {
                            selectedEffect.severity
                          }
                        </p>

                        <p>
                          <strong>
                            Start:
                          </strong>{" "}
                          {formatDateTime(
                            selectedEffect.startTime
                          )}
                        </p>

                        <p>
                          <strong>
                            End:
                          </strong>{" "}
                          {formatDateTime(
                            selectedEffect.endTime
                          )}
                        </p>

                        <hr />

                        <h3>
                          Mission
                          Impact
                        </h3>

                        <p>
                          {selectedEffect.description ||
                            "No mission impact description has been provided."}
                        </p>

                        <div
                          ref={
                            paceRef
                          }
                        >
                          <h3>
                            Recommended
                            Action /
                            PACE
                            Guidance
                          </h3>

                          <p>
                            {selectedEffect.recommendedAction ||
                              "No recommended action has been provided."}
                          </p>
                        </div>
                      </section>
                    ) : (
                      <section className="effect-panel">
                        <p className="eyebrow">
                          Space Effect
                          Report
                        </p>

                        <h2>
                          No Effects
                        </h2>

                        <p>
                          There are
                          currently no
                          space effect
                          reports
                          available.
                        </p>
                      </section>
                    )}

                    <section className="map-panel">
                      <h2>
                        Selected Effect
                        Area
                      </h2>

                      <AreaMap
                        location={
                          selectedEffect?.locationData
                        }
                      />
                    </section>
                  </div>
                </section>

                <section
                  className="map-panel"
                  ref={mapRef}
                >
                  <div className="dashboard-title">
                    <h2>
                      Current
                      Degradation
                      Areas
                    </h2>

                    <p>
                      Active effect
                      locations and
                      reported impact
                      radii.
                    </p>
                  </div>

                  <p>
                    <strong>
                      {
                        degradationLocations.length
                      }
                    </strong>{" "}
                    active{" "}
                    {degradationLocations.length ===
                    1
                      ? "degradation area"
                      : "degradation areas"}
                  </p>

                  <AreaMap
                    locations={
                      degradationLocations
                    }
                  />
                </section>
              </>
            )}
        </section>
      </div>
    </main>
  );
}

export default ArmyDashboard;