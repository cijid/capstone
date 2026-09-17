import { Link, useNavigate } from "react-router-dom";
import { capabilities } from "../data/mockData";
import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";
import { logoutUser } from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";
import { useState } from "react";

function SplashPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  const operationalCount = capabilities.filter(
    (capability) => capability.status === "Operational",
  ).length;

  const degradedCount = capabilities.filter(
    (capability) => capability.status === "Degraded",
  ).length;

  return (
    <main className="splash-page">
      {loading ? <LoadingOverlay /> : ""}
      <div className="splash-header">
        <button onClick={handleLogout}>Logout</button>
        <p>
          {user.name} ({user.branch.toUpperCase()})
        </p>
      </div>
      <section className="splash-content">
        <div className="splash-heading">
          <img className="starshield-logo" src="/images/StarShield1.png" />

          <p className="eyebrow">Joint Operational Tool</p>

          <h1>Joint Space Support Tracker</h1>

          <p className="subtitle">
            Shared Space Capability Situational Awareness
          </p>
        </div>

        <div className="view-heading1">
          <h2>Select Your Operational View</h2>
          <p>Choose a view based on your mission role.</p>
        </div>

        <div className="role-selection">
          {user.branch == "army" || user.admin ? (
            <article className="role-card army-role">
              <img className="role-icon" src="/images/armylogo.webp" />
              {/* <div className="role-icon">AR</div> */}

              <h3>Army</h3>

              <p>
                View space-enabled capabilities, active effects, mission
                impacts, and recommended actions.
              </p>

              <button onClick={() => navigate("/army")}>Enter Army View</button>
            </article>
          ) : (
            ""
          )}

          {user.branch == "ussf" || user.admin ? (
            <article className="role-card space-force-role">
              <img className="role-icon" src="/images/spaceforcelogo.png" />
              {/* <div className="role-icon">SF</div> */}

              <h3>Space Force</h3>

              <p>
                Monitor capability status, report operational effects, and
                provide mitigation guidance.
              </p>

              <button onClick={() => navigate("/space-force")}>
                Enter Space Force View
              </button>
            </article>
          ) : (
            ""
          )}
          <article className="role-card strategic-view-role">
            <img className="role-icon" src="/images/earthicon.png" />
            <h3>Strategic View</h3>

            <p>Orbital view of locations and capabilities.</p>
            <button onClick={() => navigate("/space-coverage")}>
              Enter Strategic View
            </button>
          </article>
        </div>

        <div className="operational-summary">
          <div className="summary-item">
            <span className="summary-number available-number">
              {operationalCount}
            </span>
            <span>Operational</span>
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
            <span className="summary-number">{capabilities.length}</span>
            <span>Total Capabilities</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SplashPage;
