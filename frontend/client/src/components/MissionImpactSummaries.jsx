function MissionImpactSummary({ assessment }) {
  if (!assessment) {
    return null;
  }

  const statusClass = assessment.status.toLowerCase().replaceAll(" ", "-");

  return (
    <section className="mission-impact-summary">
      <div className="mission-impact-header">
        <div>
          <p className="panel-label">Mission Assessment</p>

          <h2>Required Capability Status</h2>
        </div>

        <span className={`mission-status mission-${statusClass}`}>
          {assessment.status}
        </span>
      </div>

      <p className="mission-impact-reason">{assessment.reason}</p>

      <div className="mission-impact-counts">
        <div>
          <span>Required</span>

          <strong>{assessment.total}</strong>
        </div>

        <div>
          <span>Available</span>

          <strong>{assessment.available}</strong>
        </div>

        <div>
          <span>Degraded</span>

          <strong>{assessment.degraded}</strong>
        </div>

        <div>
          <span>Coverage Gap</span>

          <strong>{assessment.noCoverage}</strong>
        </div>

        <div>
          <span>Unavailable</span>

          <strong>{assessment.unavailable}</strong>
        </div>

        <div>
          <span>Unknown</span>

          <strong>{assessment.unknown}</strong>
        </div>
      </div>
    </section>
  );
}

export default MissionImpactSummary;
