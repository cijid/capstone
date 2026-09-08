function EffectCard({
  effect,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <article className="sf-effect-card">
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

          <strong>{effect.severity}</strong>
        </div>

        <div>
          <span className="detail-label">
            Confidence
          </span>

          <strong>{effect.confidence}</strong>
        </div>

        <div>
          <span className="detail-label">
            Status
          </span>

          <strong>{effect.status}</strong>
        </div>
      </div>

      <div className="effect-actions">
        <button onClick={() => onView(effect)}>
          View Details
        </button>

        <button onClick={() => onEdit(effect)}>
          Edit
        </button>

        <button
          className="delete-effect-button"
          onClick={() => onDelete(effect)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default EffectCard;