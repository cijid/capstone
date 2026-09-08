import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CapabilityCard from "../components/CapabilityCard";
import AreaMap from "../components/AreaMap";

import {
  capabilities,
  effects,
} from "../data/mockData";

import "../styles/army.css";

function ArmyDashboard() {
  const navigate = useNavigate();

  const overviewRef = useRef(null);
  const effectsRef = useRef(null);
  const mapRef = useRef(null);
  const paceRef = useRef(null);

  const [activeSection, setActiveSection] = useState("overview");

  const activeEffect = effects.find(
    (effect) => effect.status === "Active"
  );

  function scrollToSection(ref, section) {
    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="army-dashboard">
      <aside className="army-sidebar">
        <p className="army-sidebar-title">
          ARMY VIEW
        </p>

        <nav className="army-sidebar-nav">
          <button
            className={`sidebar-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() =>
              scrollToSection(overviewRef, "overview")
            }
          >
            ▣ Overview
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "map" ? "active" : ""
            }`}
            onClick={() =>
              scrollToSection(mapRef, "map")
            }
          >
            ⌖ Map
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "effects" ? "active" : ""
            }`}
            onClick={() =>
              scrollToSection(effectsRef, "effects")
            }
          >
            ✦ Effects
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "pace" ? "active" : ""
            }`}
            onClick={() =>
              scrollToSection(paceRef, "pace")
            }
          >
            ▤ PACE Guidance
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              window.alert(
                "Settings are not available yet."
              )
            }
          >
            ⚙ Settings
          </button>
        </nav>
      </aside>

      <div className="army-workspace">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              Army Operational View
            </p>

            <h1>
              Joint Space Support Tracker
            </h1>
          </div>

          <button onClick={() => navigate("/")}>
            ← Home
          </button>
        </header>

        <section
          className="dashboard-content"
          ref={overviewRef}
        >
          <div className="dashboard-title">
            <h2>
              Capability Status
            </h2>

            <p>
              Current space-enabled capability
              availability.
            </p>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability) => (
              <CapabilityCard
                key={capability.id}
                capability={capability}
                isSelected={false}
                onClick={() => {}}
              />
            ))}
          </div>

          <div className="army-bottom-row">
            {activeEffect && (
              <section
                className="effect-panel"
                ref={effectsRef}
              >
                <p className="eyebrow">
                  Active Space Effect
                </p>

                <h2>
                  {activeEffect.title}
                </h2>

                <p>
                  <strong>Location:</strong>{" "}
                  {activeEffect.location}
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {activeEffect.confidence}
                </p>

                <hr />

                <h3>
                  Mission Impact
                </h3>

                <p>
                  {activeEffect.description}
                </p>

                <div ref={paceRef}>
                  <h3>
                    Recommended Action
                  </h3>

                  <p>
                    {activeEffect.recommendedAction}
                  </p>

                  <button
                    onClick={() =>
                      window.alert(
                        "PACE Guidance will be connected to backend data."
                      )
                    }
                  >
                    View PACE Guidance →
                  </button>
                </div>
              </section>
            )}

            <section
              className="map-panel"
              ref={mapRef}
            >
              <h2>
                Area of Effect
              </h2>

              <AreaMap />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ArmyDashboard;