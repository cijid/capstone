function CapabilityCard({ capability, onClick, isSelected }) {
  const statusClass = capability.status.toLowerCase();

  return (
    <article
      className={`capability-card capability-${statusClass} ${
        isSelected ? "capability-selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="capability-card-header">
        <h3>{capability.name}</h3>

        <span className={`status-dot ${statusClass}`} />
      </div>

      <p className="capability-status">{capability.status}</p>

      <p className="capability-effects">
        {capability.activeEffects === 1
          ? "1 Active Effect"
          : `${capability.activeEffects} Active Effects`}
      </p>
    </article>
  );
}

export default CapabilityCard;