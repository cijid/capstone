import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { loginUser } from "../services/api";
import "../styles/login.css";
import LoadingOverlay from "../components/LoadingOverlay";

function SpaceForceLogin() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const authenticatedUser = await loginUser(email, password);

      if (!authenticatedUser?.id) {
        setUser(null);
        setMessage("Invalid email or password.");
        return;
      }

      setUser(authenticatedUser);

      navigate("/");
    } catch (error) {
      setUser(null);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="viewer-login-page">
      {loading ? <LoadingOverlay /> : ""}
      <section className="viewer-login-card">
        <img
          className="viewer-login-logo"
          src="/images/armylogo.webp"
          alt="Army Logo"
        />
        <img
          className="viewer-login-logo"
          src="/images/spaceforcelogo.png"
          alt="Space Force Logo"
        />

        <p className="viewer-login-label">Joint Space Support Tracker</p>

        <h1>Sign In</h1>
        <p className="viewer-login-description">Sign in to access the JSST.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="space-force-password">Password</label>

          <input
            id="space-force-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="space-force-login-button">
            Sign In
          </button>

          <p className="viewer-login-message" role="status">
            {message}
          </p>
        </form>

        <footer className="registration-footer">
          <span>Not a User/Admin?</span>

          <Link className="register-link" to="/register">
            Register Here
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default SpaceForceLogin;
