function CapabilityCard({ capability }) {
    const isDegraded = capability.status === "Degraded";

    return (
        <article
            className={`capability-card ${
                isDegraded ? "capability-degraded" : "capability-available"
            }`}
        >
            <div className="capability-card-header">
                <h3>{capability.name}</h3>

                <span className={`status-dot ${isDegraded ? "warning" : "good"}`} />
            </div>

            <p className="capability-status">
                {capability.status}
            </p>

            <p className="capability-effects">
                {capability.activeEffects === 1
                ? "1 Active Effect"
                : `${capability.activeEffects} Active Effects`}
            </p>
        </article>
    );
}

export default CapabilityCard;