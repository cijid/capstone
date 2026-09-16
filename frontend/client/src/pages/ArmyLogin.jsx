import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

function ArmyLogin() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("Not Avalaible");
  }

  return (
    <main className="viewer-login-page">
      <section className="viewer-login-card">
        <img
          className="viewer-login-logo"
          src="/images/armylogo.webp"
          alt="Army Logo"
        />

        <p className="viewer-login-label">Joint Space Support Tracker</p>

        <h1>Army Sign In</h1>
        <p className="viewer-login-description">
          Sign in to access the Army viewer.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="army-username">Username</label>

          <input
            id="army-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
          />

          <label htmlFor="army-password">Password</label>

          <input
            id="army-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          <button type="submit" className="army-login-button">
            Sign In to Army
          </button>

          <p className="viewer-login-message" role="status">
            {message}
          </p>
        </form>

        <Link className="viewer-login-back" to="/">
          ← Back to viewer selection
        </Link>
      </section>
    </main>
  );
}

export default ArmyLogin;
