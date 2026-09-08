function EffectDetailsModal({
  effect,
  onClose,
}) {
  if (!effect) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="effect-detail-modal">
        <div className="modal-header">
          <div>
            <p className="section-label">
              {effect.capability}
            </p>

            <h2>{effect.title}</h2>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
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

              <strong>{effect.status}</strong>
            </div>

            <div>
              <span className="detail-label">
                Severity
              </span>

              <strong>{effect.severity}</strong>
            </div>

            <div>
              <span className="detail-label">
                Confidence
              </span>

              <strong>{effect.confidence}</strong>
            </div>
          </div>

          <div className="effect-detail-section">
            <h3>
              Location / Area of Effect
            </h3>

            <p>{effect.location}</p>

            <div className="detail-map-placeholder">
              Map / Area of Effect Placeholder
            </div>
          </div>

          <div className="effect-detail-section">
            <h3>Mission Impact</h3>

            <p>{effect.description}</p>
          </div>

          <div className="effect-detail-section">
            <h3>
              Recommended Action / PACE Guidance
            </h3>

            <p>
              {effect.recommendedAction ||
                "No mitigation guidance provided."}
            </p>
          </div>

          <div className="detail-time-grid">
            <div>
              <span className="detail-label">
                Start Time
              </span>

              <strong>
                {effect.startTime ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span className="detail-label">
                End Time
              </span>

              <strong>
                {effect.endTime ||
                  "Ongoing"}
              </strong>
            </div>
          </div>

          <div className="detail-modal-actions">
            <button
              className="secondary-button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EffectDetailsModal;