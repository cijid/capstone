import { useNavigate } from "react-router-dom";
import { capabilities, effects } from "../data/mockData";

function ArmyDashboard() {
  const navigate = useNavigate();

  const activeEffects = effects.filter((effect) => effect.status === "Active");

  return (
    <main className="army-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Army Operational View</p>
          <h1>Joint Space Support Tracker</h1>
        </div>

        <button onClick={() => navigate("/")}>
          ← Home
        </button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-title">
          <h2>Capability Status</h2>
          <p>Current availability of space-enabled capabilities.</p>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability-card" key={capability.id}>
              <h3>{capability.name}</h3>

              <span
                className={`capability-status ${capability.status.toLowerCase()}`}
              >
                {capability.status}
              </span>

              <p>
                Active effects: {capability.activeEffects}
              </p>
            </article>
          ))}
        </div>

        <div className="dashboard-title">
          <h2>Active Space Effects</h2>
          <p>Effects that may impact Army operations.</p>
        </div>

        {activeEffects.map((effect) => (
          <section className="effect-panel" key={effect.id}>
            <p className="eyebrow">{effect.status} Effect</p>
            <h2>{effect.title}</h2>

            <p><strong>Capability:</strong> {effect.capability}</p>
            <p><strong>Severity:</strong> {effect.severity}</p>
            <p><strong>Location:</strong> {effect.location}</p>

            <hr />

            <h3>Mission Impact</h3>
            <p>{effect.description}</p>

            <h3>Recommended Action</h3>
            <p>{effect.recommendedAction}</p>

            <button>View PACE Guidance →</button>
          </section>
        ))}
      </section>
    </main>
  );
}

export default ArmyDashboard;