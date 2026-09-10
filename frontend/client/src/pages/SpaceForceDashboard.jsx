import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import EffectCard from "../components/EffectCard";
import EffectDetailsModal from "../components/EffectDetailsModal";
import EffectFilters from "../components/EffectFilters";
import EditEffectForm from "../components/EditEffectForm";
import ReportEffectForm from "../components/ReportEffectForm";

import {
  deleteReport,
  getCapabilities,
  getReports,
} from "../services/api";

import {
  transformCapability,
  transformReport,
} from "../utils/backendData";

import "../styles/spaceForce.css";

function SpaceForceDashboard() {
  const navigate = useNavigate();

  const overviewRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const effectsRef = useRef(null);

  const [effects, setEffects] = useState([]);
  const [capabilities, setCapabilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showReportForm, setShowReportForm] =
    useState(false);

  const [selectedEffect, setSelectedEffect] =
    useState(null);

  const [editingEffect, setEditingEffect] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState("Active");

  const [
    capabilityFilter,
    setCapabilityFilter,
  ] = useState("All");

  const [activeSection, setActiveSection] =
    useState("overview");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setApiError("");

        const [
          reportData,
          capabilityData,
        ] = await Promise.all([
          getReports(),
          getCapabilities(),
        ]);

        setEffects(
          reportData.map(transformReport)
        );

        setCapabilities(
          capabilityData.map(
            transformCapability
          )
        );
      } catch (error) {
        console.error(
          "Unable to load dashboard data:",
          error
        );

        setApiError(
          "Unable to connect to the backend API."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
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

  const calculatedCapabilities =
    capabilityCategories.map((capability) => {
      const activeEffects = effects.filter(
        (effect) =>
          effect.capabilityCategory ===
            capability.name &&
          effect.status === "Active"
      );

      return {
        ...capability,

        activeEffects:
          activeEffects.length,

        status:
          activeEffects.length > 0
            ? "Degraded"
            : "Available",
      };
    });

  const filteredEffects =
    effects.filter((effect) => {
      const matchesStatus =
        statusFilter === "All" ||
        effect.status === statusFilter;

      const matchesCapability =
        capabilityFilter === "All" ||
        effect.capabilityCategory ===
          capabilityFilter;

      return (
        matchesStatus &&
        matchesCapability
      );
    });

  function scrollToSection(
    ref,
    section
  ) {
    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleCapabilityClick(
    capabilityName
  ) {
    if (
      capabilityFilter ===
      capabilityName
    ) {
      setCapabilityFilter("All");
    } else {
      setCapabilityFilter(
        capabilityName
      );
    }
  }

  function handleAddEffect(newEffect) {
    const effectToAdd = {
      ...newEffect,

      id: `local-${Date.now()}`,

      capability:
        newEffect.capability,

      capabilityCategory:
        newEffect.capability,

      location:
        newEffect.locationName,

      locationData: {
        name: newEffect.locationName,

        y_coord:
          Number(newEffect.latitude),

        x_coord:
          Number(newEffect.longitude),

        radius:
          Number(newEffect.radius),
      },

      severity:
        Number(newEffect.severity),

      confidence:
        Number(newEffect.confidence),

      status: "Active",
    };

    setEffects((currentEffects) => [
      ...currentEffects,
      effectToAdd,
    ]);

    setShowReportForm(false);
    setActiveSection("overview");
  }

  function handleEditEffect(effect) {
    setEditingEffect({
      ...effect,
    });
  }

  function handleEditChange(event) {
    const {
      name,
      value,
    } = event.target;

    setEditingEffect(
      (currentEffect) => ({
        ...currentEffect,
        [name]: value,
      })
    );
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    setEffects((currentEffects) =>
      currentEffects.map((effect) =>
        effect.id === editingEffect.id
          ? editingEffect
          : effect
      )
    );

    setEditingEffect(null);
  }

  async function handleDeleteEffect(
    effect
  ) {
    const shouldDelete =
      window.confirm(
        `Delete "${effect.title}"?`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      if (
        !String(effect.id).startsWith(
          "local-"
        )
      ) {
        await deleteReport(effect.id);
      }

      setEffects((currentEffects) =>
        currentEffects.filter(
          (currentEffect) =>
            currentEffect.id !==
            effect.id
        )
      );

      if (
        selectedEffect?.id ===
        effect.id
      ) {
        setSelectedEffect(null);
      }

      if (
        editingEffect?.id ===
        effect.id
      ) {
        setEditingEffect(null);
      }
    } catch (error) {
      console.error(
        "Unable to delete report:",
        error
      );

      window.alert(
        "Unable to delete effect report."
      );
    }
  }

  return (
    <div className="sf-dashboard">
      <aside className="sf-sidebar">
        <p className="sf-sidebar-title">
          SPACE FORCE VIEW
        </p>

        <nav className="sf-sidebar-nav">
          <button
            className={`sf-sidebar-item ${
              activeSection === "overview"
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
            className={`sf-sidebar-item ${
              activeSection ===
              "capabilities"
                ? "active"
                : ""
            }`}
            onClick={() =>
              scrollToSection(
                capabilitiesRef,
                "capabilities"
              )
            }
          >
            ◈ Capabilities
          </button>

          <button
            className={`sf-sidebar-item ${
              activeSection === "effects"
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
            className={`sf-sidebar-item ${
              activeSection === "report"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveSection("report");
              setShowReportForm(true);
            }}
          >
            + Report Effect
          </button>

          <button
            className="sf-sidebar-item"
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

      <div className="sf-workspace">
        <header className="sf-header">
          <div>
            <p className="sf-header-label">
              Space Force Operational View
            </p>

            <h1>
              Joint Space Support Tracker
            </h1>
          </div>

          <div className="sf-header-actions">
            <button
              className="sf-home-button"
              onClick={() =>
                navigate("/")
              }
            >
              ← Home
            </button>
          </div>
        </header>

        <main className="sf-content">
          <section
            className="sf-page-heading"
            ref={overviewRef}
          >
            <div>
              <p className="section-label">
                SPACE CAPABILITY MANAGEMENT
              </p>

              <h2>
                Operational Status
              </h2>

              <p>
                Monitor and manage space
                capability effects impacting
                supported forces.
              </p>
            </div>
          </section>

          {apiError && (
            <div className="empty-effects">
              <h3>
                Backend Connection Error
              </h3>

              <p>{apiError}</p>
            </div>
          )}

          {loading && (
            <div className="empty-effects">
              <h3>
                Loading Operational Data
              </h3>

              <p>
                Retrieving capability and
                effect information.
              </p>
            </div>
          )}

          {!loading && !apiError && (
            <>
              <section
                className="sf-section"
                ref={capabilitiesRef}
              >
                <div className="section-heading">
                  <h2>
                    Capability Status
                  </h2>

                  <span>
                    {
                      calculatedCapabilities.length
                    }{" "}
                    Capabilities
                  </span>
                </div>

                <div className="capability-grid">
                  {calculatedCapabilities.map(
                    (capability) => (
                      <CapabilityCard
                        key={capability.id}
                        capability={
                          capability
                        }
                        isSelected={
                          capabilityFilter ===
                          capability.name
                        }
                        onClick={() =>
                          handleCapabilityClick(
                            capability.name
                          )
                        }
                      />
                    )
                  )}
                </div>
              </section>

              <section
                className="sf-section"
                ref={effectsRef}
              >
                <div className="section-heading">
                  <div>
                    <h2>
                      Effect Reports
                    </h2>

                    {capabilityFilter !==
                      "All" && (
                      <p className="current-filter">
                        Showing{" "}
                        {capabilityFilter}{" "}
                        effects
                      </p>
                    )}
                  </div>

                  <span>
                    {filteredEffects.length}{" "}
                    {filteredEffects.length ===
                    1
                      ? "Report"
                      : "Reports"}
                  </span>
                </div>

                <EffectFilters
                  statusFilter={
                    statusFilter
                  }
                  setStatusFilter={
                    setStatusFilter
                  }
                  capabilityFilter={
                    capabilityFilter
                  }
                  clearCapabilityFilter={() =>
                    setCapabilityFilter(
                      "All"
                    )
                  }
                />

                <div className="effects-list">
                  {filteredEffects.length >
                  0 ? (
                    filteredEffects.map(
                      (effect) => (
                        <EffectCard
                          key={effect.id}
                          effect={effect}
                          onView={
                            setSelectedEffect
                          }
                          onEdit={
                            handleEditEffect
                          }
                          onDelete={
                            handleDeleteEffect
                          }
                        />
                      )
                    )
                  ) : (
                    <div className="empty-effects">
                      <h3>
                        No Matching Effects
                      </h3>

                      <p>
                        There are no effect
                        reports matching the
                        selected filters.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {showReportForm && (
        <ReportEffectForm
          onSubmit={handleAddEffect}
          onCancel={() => {
            setShowReportForm(false);
            setActiveSection(
              "overview"
            );
          }}
        />
      )}

      <EffectDetailsModal
        effect={selectedEffect}
        onClose={() =>
          setSelectedEffect(null)
        }
      />

      <EditEffectForm
        effect={editingEffect}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        onCancel={() =>
          setEditingEffect(null)
        }
      />
    </div>
  );
}

export default SpaceForceDashboard;