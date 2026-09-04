import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import ReportEffectForm from "../components/ReportEffectForm";
import { capabilities, effects as initialEffects } from "../data/mockData";

import "../styles/spaceForce.css";

function SpaceForceDashboard() {
  const navigate = useNavigate();

  const [effects, setEffects] = useState(initialEffects);
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [editingEffect, setEditingEffect] = useState(null);

  const calculatedCapabilities = capabilities.map((capability) => {
    const activeEffects = effects.filter(
      (effect) =>
        effect.capability === capability.name &&
        effect.status === "Active"
    );

    return {
      ...capability,
      activeEffects: activeEffects.length,
      status: activeEffects.length > 0 ? "Degraded" : "Available",
    };
  });

  const activeEffects = effects.filter(
    (effect) => effect.status === "Active"
  );

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

  return (
    <div className="sf-dashboard">
      <header className="sf-header">
        <div className="sf-header-left">
          <button
            className="home-button"
            onClick={() => navigate("/")}
          >
            JS
          </button>

          <div>
            <h1>Joint Space Support Tracker</h1>
            <p>Space Force Operational View</p>
          </div>
        </div>

        <div className="sf-header-right">
          <span className="live-indicator">
            <span className="live-dot"></span>
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

            <h2>Operational Status</h2>

            <p>
              Monitor and manage space capability effects
              impacting supported forces.
            </p>
          </div>

          <button
            className="report-effect-button"
            onClick={() => setShowReportForm(true)}
          >
            + Report New Effect
          </button>
        </section>

        <section className="sf-section">
          <div className="section-heading">
            <h2>Capability Status</h2>

            <span>
              {calculatedCapabilities.length} Capabilities
            </span>
          </div>

          <div className="capability-grid">
            {calculatedCapabilities.map((capability) => (
              <CapabilityCard
                key={capability.id}
                capability={capability}
              />
            ))}
          </div>
        </section>

        <section className="sf-section">
          <div className="section-heading">
            <h2>Active Effects</h2>

            <span>
              {activeEffects.length} Active
            </span>
          </div>

          <div className="effects-list">
            {effects.map((effect) => (
              <article
                className="sf-effect-card"
                key={effect.id}
              >
                <div className="effect-main">
                  <div className="effect-title-row">
                    <span className="effect-capability">
                      {effect.capability}
                    </span>

                    <h3>{effect.title}</h3>
                  </div>

                  <p>{effect.description}</p>

                  <p className="effect-location">
                    {effect.location}
                  </p>
                </div>

                <div className="effect-details">
                  <div>
                    <span className="detail-label">
                      Severity
                    </span>

                    <strong>
                      {effect.severity}
                    </strong>
                  </div>

                  <div>
                    <span className="detail-label">
                      Confidence
                    </span>

                    <strong>
                      {effect.confidence}
                    </strong>
                  </div>

                  <div>
                    <span className="detail-label">
                      Status
                    </span>

                    <strong>
                      {effect.status}
                    </strong>
                  </div>
                </div>

                <div className="effect-actions">
                  <button
                    onClick={() =>
                      setSelectedEffect(effect)
                    }
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      setEditingEffect({ ...effect })
                    }
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showReportForm && (
        <ReportEffectForm
          onSubmit={handleAddEffect}
          onCancel={() =>
            setShowReportForm(false)
          }
        />
      )}

      {selectedEffect && (
        <div className="modal-backdrop">
          <div className="effect-detail-modal">
            <div className="modal-header">
              <div>
                <p className="section-label">
                  {selectedEffect.capability}
                </p>

                <h2>
                  {selectedEffect.title}
                </h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setSelectedEffect(null)
                }
              >
                X
              </button>
            </div>

            <div className="effect-detail-content">
              <div className="detail-summary-grid">
                <div>
                  <span className="detail-label">
                    Status
                  </span>

                  <strong>
                    {selectedEffect.status}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">
                    Severity
                  </span>

                  <strong>
                    {selectedEffect.severity}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">
                    Confidence
                  </span>

                  <strong>
                    {selectedEffect.confidence}
                  </strong>
                </div>
              </div>

              <div className="effect-detail-section">
                <h3>
                  Location / Area of Effect
                </h3>

                <p>
                  {selectedEffect.location}
                </p>

                <div className="detail-map-placeholder">
                  Map / Area of Effect Placeholder
                </div>
              </div>

              <div className="effect-detail-section">
                <h3>Mission Impact</h3>

                <p>
                  {selectedEffect.description}
                </p>
              </div>

              <div className="effect-detail-section">
                <h3>
                  Recommended Action / PACE Guidance
                </h3>

                <p>
                  {selectedEffect.recommendedAction ||
                    "No mitigation guidance provided."}
                </p>
              </div>

              <div className="detail-time-grid">
                <div>
                  <span className="detail-label">
                    Start Time
                  </span>

                  <strong>
                    {selectedEffect.startTime ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">
                    End Time
                  </span>

                  <strong>
                    {selectedEffect.endTime ||
                      "Ongoing"}
                  </strong>
                </div>
              </div>

              <div className="detail-modal-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    setSelectedEffect(null)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingEffect && (
        <div className="modal-backdrop">
          <div className="report-modal">
            <div className="modal-header">
              <h2>Edit Effect</h2>

              <button
                type="button"
                className="close-button"
                onClick={() =>
                  setEditingEffect(null)
                }
              >
                X
              </button>
            </div>

            <form
              className="report-form"
              onSubmit={handleEditSubmit}
            >
              <label>
                Capability
                <select
                  name="capability"
                  value={editingEffect.capability}
                  onChange={handleEditChange}
                >
                  <option value="PNT">
                    PNT
                  </option>

                  <option value="SATCOM">
                    SATCOM
                  </option>

                  <option value="MW/MT">
                    MW/MT
                  </option>
                </select>
              </label>

              <label>
                Effect Name
                <input
                  type="text"
                  name="title"
                  value={editingEffect.title}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Severity
                  <select
                    name="severity"
                    value={editingEffect.severity}
                    onChange={handleEditChange}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </label>

                <label>
                  Confidence
                  <select
                    name="confidence"
                    value={editingEffect.confidence}
                    onChange={handleEditChange}
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </label>
              </div>

              <label>
                Status
                <select
                  name="status"
                  value={editingEffect.status}
                  onChange={handleEditChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Monitoring">
                    Monitoring
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>
                </select>
              </label>

              <label>
                Location / Area of Effect
                <input
                  type="text"
                  name="location"
                  value={editingEffect.location}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Description / Mission Impact
                <textarea
                  name="description"
                  value={editingEffect.description}
                  onChange={handleEditChange}
                  rows="4"
                  required
                />
              </label>

              <label>
                Recommended Action / PACE Guidance
                <textarea
                  name="recommendedAction"
                  value={
                    editingEffect.recommendedAction
                  }
                  onChange={handleEditChange}
                  rows="3"
                />
              </label>

              <div className="form-row">
                <label>
                  Start Time
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={editingEffect.startTime}
                    onChange={handleEditChange}
                  />
                </label>

                <label>
                  End Time
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={editingEffect.endTime}
                    onChange={handleEditChange}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setEditingEffect(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpaceForceDashboard;