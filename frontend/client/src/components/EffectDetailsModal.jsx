import AreaMap from "./AreaMap";

function EffectDetailsModal({ effect, onClose }) {
  if (!effect) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="effect-detail-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="section-label">
              EFFECT REPORT
            </p>

            <h2>{effect.title}</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="effect-detail-content">
          <div className="detail-summary-grid">
            <div>
              <span className="detail-label">
                Capability
              </span>

              <strong>
                {effect.capability}
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

            <div>
              <span className="detail-label">
                Confidence
              </span>

              <strong>
                {effect.confidence}
              </strong>
            </div>
          </div>

          <section className="effect-detail-section">
            <h3>Location</h3>

            <p>{effect.location}</p>
          </section>

          <section className="effect-detail-section">
            <h3>Mission Impact</h3>

            <p>{effect.description}</p>
          </section>

          <section className="effect-detail-section">
            <h3>Recommended Action</h3>

            <p>{effect.recommendedAction}</p>
          </section>

          <section className="effect-detail-section">
            <h3>Area of Effect</h3>

            <div className="detail-map">
              <AreaMap />
            </div>
          </section>

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