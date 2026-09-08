import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import EffectCard from "../components/EffectCard";
import EffectDetailsModal from "../components/EffectDetailsModal";
import EffectFilters from "../components/EffectFilters";
import EditEffectForm from "../components/EditEffectForm";
import ReportEffectForm from "../components/ReportEffectForm";

import {
  capabilities,
  effects as initialEffects,
} from "../data/mockData";

import "../styles/spaceForce.css";

function SpaceForceDashboard() {
  const navigate = useNavigate();

  const overviewRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const effectsRef = useRef(null);

  const [effects, setEffects] = useState(initialEffects);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [editingEffect, setEditingEffect] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [capabilityFilter, setCapabilityFilter] = useState("All");

  const calculatedCapabilities = capabilities.map((capability) => {
    const activeEffects = effects.filter(
      (effect) =>
        effect.capability === capability.name &&
        effect.status === "Active"
    );

    return {
      ...capability,
      activeEffects: activeEffects.length,
      status:
        activeEffects.length > 0
          ? "Degraded"
          : "Available",
    };
  });

  const filteredEffects = effects.filter((effect) => {
    const matchesStatus =
      statusFilter === "All" ||
      effect.status === statusFilter;

    const matchesCapability =
      capabilityFilter === "All" ||
      effect.capability === capabilityFilter;

    return matchesStatus && matchesCapability;
  });

  function scrollToSection(ref) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleCapabilityClick(capabilityName) {
    if (capabilityFilter === capabilityName) {
      setCapabilityFilter("All");
    } else {
      setCapabilityFilter(capabilityName);
    }
  }

  function handleAddEffect(newEffect) {
    const effectToAdd = {
      ...newEffect,
      id: Date.now(),
      status: "Active",
    };

    setEffects((currentEffects) => [
      ...currentEffects,
      effectToAdd,
    ]);

    setShowReportForm(false);
  }

  function handleEditEffect(effect) {
    setEditingEffect({
      ...effect,
    });
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditingEffect((currentEffect) => ({
      ...currentEffect,
      [name]: value,
    }));
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

  function handleDeleteEffect(effect) {
    const shouldDelete = window.confirm(
      `Delete "${effect.title}"?`
    );

    if (!shouldDelete) {
      return;
    }

    setEffects((currentEffects) =>
      currentEffects.filter(
        (currentEffect) =>
          currentEffect.id !== effect.id
      )
    );

    if (selectedEffect?.id === effect.id) {
      setSelectedEffect(null);
    }

    if (editingEffect?.id === effect.id) {
      setEditingEffect(null);
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
            className="sf-sidebar-item active"
            onClick={() => scrollToSection(overviewRef)}
          >
            ▣ Overview
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => scrollToSection(capabilitiesRef)}
          >
            ◈ Capabilities
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => scrollToSection(effectsRef)}
          >
            ✦ Effects
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() => setShowReportForm(true)}
          >
            + Report Effect
          </button>

          <button
            className="sf-sidebar-item"
            onClick={() =>
              window.alert("Settings are not available yet.")
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
              onClick={() => navigate("/")}
            >
              ← Home
            </button>
          </div>
        </header>

        <main className="sf-content">
          <section
            className="sf-section"
            ref={capabilitiesRef}
          >
            <div className="section-heading">
              <h2>
                Capability Status
              </h2>

              <span>
                {calculatedCapabilities.length} Capabilities
              </span>
            </div>

            <div className="capability-grid">
              {calculatedCapabilities.map(
                (capability) => (
                  <CapabilityCard
                    key={capability.id}
                    capability={capability}
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

                {capabilityFilter !== "All" && (
                  <p className="current-filter">
                    Showing {capabilityFilter} effects
                  </p>
                )}
              </div>

              <span>
                {filteredEffects.length}{" "}
                {filteredEffects.length === 1
                  ? "Report"
                  : "Reports"}
              </span>
            </div>

            <EffectFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              capabilityFilter={capabilityFilter}
              clearCapabilityFilter={() =>
                setCapabilityFilter("All")
              }
            />

            <div className="effects-list">
              {filteredEffects.length > 0 ? (
                filteredEffects.map((effect) => (
                  <EffectCard
                    key={effect.id}
                    effect={effect}
                    onView={setSelectedEffect}
                    onEdit={handleEditEffect}
                    onDelete={handleDeleteEffect}
                  />
                ))
              ) : (
                <div className="empty-effects">
                  <h3>
                    No Matching Effects
                  </h3>

                  <p>
                    There are no effect reports matching
                    the selected filters.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {showReportForm && (
        <ReportEffectForm
          onSubmit={handleAddEffect}
          onCancel={() =>
            setShowReportForm(false)
          }
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