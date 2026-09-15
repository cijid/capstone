import { Link } from "react-router-dom";
import "../styles/register.css";

function RegisterPage() {
    return (
        <main className="register-page">
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
          onSubmit={(event) => event.preventDefault()}
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
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="dod-id">DODID</label>
                <input
                  id="dod-id"
                  name="dodId"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your DODID"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="birth-date">Birth Date</label>
                <input
                  id="birth-date"
                  name="birthDate"
                  type="date"
                  autoComplete="bday"
                  required
                />
              </div>

              <div className="register-field register-full-width">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Role and Organization</legend>

            <div className="register-grid">
              <div className="register-field register-full-width">
                <label htmlFor="account-role">
                  Account Role
                </label>

                <select
                  id="account-role"
                  name="accountRole"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="army-user">
                    Army User
                  </option>
                  <option value="army-admin">
                    Army Admin
                  </option>
                  <option value="space-force-user">
                    Space Force User
                  </option>
                  <option value="space-force-admin">
                    Space Force Admin
                  </option>
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="brigade">Brigade</label>
                <input
                  id="brigade"
                  name="brigade"
                  type="text"
                  placeholder="Enter your brigade"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="battalion">Battalion</label>
                <input
                  id="battalion"
                  name="battalion"
                  type="text"
                  placeholder="Enter your battalion"
                  required
                />
              </div>

              <div className="register-field register-full-width">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Enter your company"
                  required
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Login Information</legend>

            <div className="register-grid">
              <div className="register-field">
                <label htmlFor="new-username">Username</label>
                <input
                  id="new-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="new-password">Password</label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </fieldset>

          <button
            className="register-submit"
            type="button">
            Register
          </button>
        </form>

        <Link className="register-back" to="/">
          ← Back to viewer selection
        </Link>        
            </section>
        </main>
    )
}

export default RegisterPage;