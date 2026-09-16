import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import { loginUser, registerUser } from "../services/api";
import { getUnits } from "../util/apiHelper";
import { useState, useEffect, useContext } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import AuthContext from "../contexts/AuthContext";

function RegisterPage() {

  const [unitList, setUnitList] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [rank, setRank] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const [unitID, setUnitID] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const retrieveUnitList = async () => {
      setUnitList(await getUnits());
    }

    retrieveUnitList();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(firstName, lastName, email, password, rank, branch, accountRole, unitID);
      const authenticatedUser = await loginUser(email, password);

      if (!authenticatedUser?.id) {
        throw new Error("Registration succeeded, but authentication failed.");
      }

      setUser(authenticatedUser);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className="register-page">
          {loading ? <LoadingOverlay /> : ""}
          <section 
          classname="register-card"
          aria-labelledby="register-heading">
          <header className="register-heading">
              <p>Joint Space Support Tracking</p>
              <h1 id="register-heading">Register an Account</h1>
              <p>Enter your information below.</p>
              </header>
          <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <legend>Personal Information</legend>

          <div className="register-grid">
            <div className="register-field">
              <label htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="dod-id">Grade</label>
              <select
                id="rank"
                name="rank"
                placeholder="Select your grade"
                onChange={(e) => setRank(e.target.value)}
                required
              >
                <option value="e1">E-1</option>
                <option value="e2">E-2</option>
                <option value="e3">E-3</option>
                <option value="e4">E-4</option>
                <option value="e5">E-5</option>
                <option value="e6">E-6</option>
                <option value="e7">E-7</option>
                <option value="e8">E-8</option>
                <option value="e9">E-9</option>
                <option value="w1">W-1</option>
                <option value="w2">W-2</option>
                <option value="w3">W-3</option>
                <option value="w4">W-4</option>
                <option value="w5">W-5</option>
                <option value="o1">O-1</option>
                <option value="o2">O-2</option>
                <option value="o3">O-3</option>
                <option value="o4">O-4</option>
                <option value="o5">O-5</option>
                <option value="o6">O-6</option>
                <option value="o7">O-7</option>
                <option value="o8">O-8</option>
                <option value="o9">O-9</option>
                <option value="o10">O-10</option>
              </select>
            </div>

            <div className="register-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Branch and Organization</legend>

          <div className="register-grid">
            <div className="register-field">
              <label htmlFor="branch">
                Branch
              </label>

              <select
                id="branch"
                name="branch"
                defaultValue=""
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your branch
                </option>
                <option value="army">
                  Army
                </option>
                <option value="ussf">
                  Space Force
                </option>
              </select>
            </div>

            <div className="register-field">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                name="unit"
                placeholder="Enter your unit"
                onChange={(e) => setUnitID(e.target.value)}
                required>
                {unitList.map((unit) => {
                  return (<option value={unit.id}>{unit.name}</option>)
                })}

                </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Login Information</legend>

          <div className="register-grid">

            <div className="register-field">
              <label htmlFor="new-password">Password</label>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="admin">Role</label>
              <select
                id="account-role"
                name="accountRole"
                defaultValue=""
                onChange={(e) => setAccountRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="true">
                  Admin
                </option>
                <option value="false">
                  User
                </option>
              </select>
            </div>
          </div>
        </fieldset>

        <button
          className="register-submit"
          type="submit">
          Register
        </button>
      </form>

      <Link className="register-back" to="/">
        ← Back to login
      </Link>        
          </section>
      </main>
  )
}

export default RegisterPage;