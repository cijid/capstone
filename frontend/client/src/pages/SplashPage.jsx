import { useNavigate } from "react-router-dom";
import { capabilities } from "../data/mockData";

function SplashPage() {
    const navigate = useNavigate();

    const availableCount = capabilities.filter(
        (capability) => capability.status === "Available"
    ).length;

    const degradedCount = capabilities.filter(
        (capability) => capability.status === "Degraded"
    ).length;

      return (
        <main className="splash-page">
        <section className="splash-content">
            <div className="splash-heading">
            <p className="eyebrow">Joint Operational Tool</p>

            <h1>Joint Space Support Tracker</h1>

            <p className="subtitle">
                Shared Space Capability Situational Awareness
            </p>
            </div>

            <div className="view-heading">
            <h2>Select Your Operational View</h2>
            <p>
                Choose a view based on your mission role.
            </p>
            </div>

            <div className="role-selection">
            <article className="role-card army-role">
                <div className="role-icon">A</div>

                <h3>Army</h3>

                <p>
                View space-enabled capabilities, active effects,
                mission impacts, and recommended actions.
                </p>

                <button onClick={() => navigate("/army")}>
                Enter Army View
                </button>
            </article>

            <article className="role-card space-force-role">
                <div className="role-icon">SF</div>

                <h3>Space Force</h3>

                <p>
                Monitor capability status, report operational
                effects, and provide mitigation guidance.
                </p>

                <button onClick={() => navigate("/space-force")}>
                Enter Space Force View
                </button>
            </article>
            </div>

            <div className="operational-summary">
            <div className="summary-item">
                <span className="summary-number available-number">
                {availableCount}
                </span>
                <span>Available</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
                <span className="summary-number degraded-number">
                {degradedCount}
                </span>
                <span>Degraded</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
                <span className="summary-number">
                {capabilities.length}
                </span>
                <span>Total Capabilities</span>
            </div>
            </div>
        </section>
        </main>
    );
    }

export default SplashPage;