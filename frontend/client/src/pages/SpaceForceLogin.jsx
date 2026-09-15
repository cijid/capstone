import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

function SpaceForceLogin() {
    const [ message, setMessage ] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setMessage("Not avalaible");
    }
    return (
        <main className="viewer-login-page">
            <section className="viewer-login-card">
                <img
                className="viewer-login-logo"
                src="/images/spaceforcelogo.png"
                alt="Space Force Logo"
                />

                <p className="viewer-login-label">
                    Joint Space Support Tracker
                </p>

                <h1>Space Force Sign In</h1>
                  <p className="viewer-login-description">
                     Sign in to access the Space Force Viewer.
                </p>

                <form onSubmit={handleSubmit}>
                <label htmlFor="space-force-username">
                     Username
                </label>

                <input
                    id="space-force-username"
                    name="username"
                    type="text"
                     autoComplete="username"
                    placeholder="Enter your username"
                />

                <label htmlFor="space-force-password">
                    Password
                </label>

                <input
                    id="space-force-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                />

                <button 
                type="submit"
                className="space-force-login-button">
                    Sign In to Space Force
                </button>

                <p
                     className="viewer-login-message"
                    role="status"
                >
                    {message}
                </p>
                </form>

                <Link className="viewer-login-back" to="/">
                        ← Back to viewer selection
                </Link> 
            </section>
        </main>
    )
}


export default SpaceForceLogin;