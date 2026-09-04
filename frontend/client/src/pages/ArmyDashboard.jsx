import { useNavigate } from "react-router-dom";
import { capabilities, effects } from "../data/mockData";

function ArmyDashboard() {
  const navigate = useNavigate();
  const activeEffect = effects.find((effect) => effect.status === "Active");

  return (
    <main className="army-dashboard">
      <aside className="army-sidebar">
        <p className="army-sidebar-title">ARMY VIEW</p>

        <nav className="army-sidebar-nav">
          <button className="sidebar-item active">▣ Overview</button>
          <button className="sidebar-item">⌖ Map</button>
          <button className="sidebar-item">✦ Effects</button>
          <button className="sidebar-item">▤ PACE Guidance</button>
          <button className="sidebar-item">⚙ Settings</button>
        </nav>

      </aside>

      <div className="army-workspace">
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
            <p>Current space-enabled capability availability.</p>
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
                  {capability.activeEffects === 1
                    ? "1 Active Effect"
                    : "No Active Effects"}
                </p>
              </article>
            ))}
          </div>

          <div className="army-bottom-row">
            <section className="effect-panel">
              <p className="eyebrow">Active Space Effect</p>
              <h2>{activeEffect.title}</h2>

              <p><strong>Location:</strong> {activeEffect.location}</p>
              <p><strong>Confidence:</strong> High</p>

              <hr />

              <h3>Mission Impact</h3>
              <p>{activeEffect.description}</p>

              <h3>Recommended Action</h3>
              <p>{activeEffect.recommendedAction}</p>

              <button>View PACE Guidance →</button>
            </section>

            <section className="map-panel">
              <h2> Area of Effect</h2>

              <div className="map-placeholder">
                <p className="map-placeholder-text">
                  MAP PLACEHOLDERRRR
                  <span>Add map here later</span>
                </p>

                <div className="map-effect-zone">
                  PNT Degradation Zone!!!!!!!!
                </div>

                <div className="map-legend">
                  <i></i>
                  PNT Degradation Zone
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ArmyDashboard;