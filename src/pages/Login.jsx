import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../style.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo">CP</div>
          <h1>ClinicPulse Analytics</h1>
          <p>
            Secure healthcare operational intelligence for claims, revenue,
            appointments, and executive decision support.
          </p>

          <div className="auth-feature-list">
            <span>Claims denial intelligence</span>
            <span>Revenue leakage monitoring</span>
            <span>Operational health scoring</span>
            <span>Executive analytics dashboard</span>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card-pro">
          <p className="auth-eyebrow">Secure Access</p>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">
            Sign in to continue to your ClinicPulse workspace.
          </p>

          <form onSubmit={handleLogin} className="auth-form">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span>•</span>
            <Link to="/register">Create account</Link>
          </div>

          <p className="auth-disclaimer">
            Demo platform only. Do not upload real patient or PHI data.
          </p>
        </div>
      </section>
    </div>
  );
}