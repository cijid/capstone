import { useState } from "react";
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

  const [effects, setEffects] =
    useState(initialEffects);

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

  const calculatedCapabilities =
    capabilities.map((capability) => {
      const activeEffects = effects.filter(
        (effect) =>
          effect.capability ===
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

  const filteredEffects = effects.filter(
    (effect) => {
      const matchesStatus =
        statusFilter === "All" ||
        effect.status === statusFilter;

      const matchesCapability =
        capabilityFilter === "All" ||
        effect.capability ===
          capabilityFilter;

      return (
        matchesStatus &&
        matchesCapability
      );
    }
  );

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
    const { name, value } =
      event.target;

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
        effect.id ===
        editingEffect.id
          ? editingEffect
          : effect
      )
    );

    setEditingEffect(null);
  }

  function handleDeleteEffect(effect) {
    const shouldDelete =
      window.confirm(
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
  }

  return (
    <div className="sf-dashboard">
      <header className="sf-header">
        <div className="sf-header-left">
          <button
            className="home-button"
            onClick={() =>
              navigate("/")
            }
          >
            JS
          </button>

          <div>
            <h1>
              Joint Space Support Tracker
            </h1>

            <p>
              Space Force Operational View
            </p>
          </div>
        </div>

        <div className="sf-header-right">
          <span className="live-indicator">
            <span className="live-dot" />
            LIVE
          </span>

          <span>Space Force</span>
        </div>
      </header>

      <main className="sf-content">
        <section className="sf-page-heading">
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

          <button
            className="report-effect-button"
            onClick={() =>
              setShowReportForm(true)
            }
          >
            + Report New Effect
          </button>
        </section>

        <section className="sf-section">
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

        <section className="sf-section">
          <div className="section-heading">
            <div>
              <h2>Effect Reports</h2>

              {capabilityFilter !==
                "All" && (
                <p className="current-filter">
                  Showing{" "}
                  {
                    capabilityFilter
                  }{" "}
                  effects
                </p>
              )}
            </div>

            <span>
              {
                filteredEffects.length
              }{" "}
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
              setCapabilityFilter("All")
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
      </main>

      {showReportForm && (
        <ReportEffectForm
          onSubmit={
            handleAddEffect
          }
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