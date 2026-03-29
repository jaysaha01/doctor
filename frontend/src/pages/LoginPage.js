import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user);
      addToast(`Welcome back, ${data.user.name}!`, "success");
      navigate(data.user.role === "admin" ? "/admin" : "/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>MediBook</h1>
          <p>Sign in to book your appointment</p>
        </div>
        <div className="card auth-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" name="email" className="form-control"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" name="password" className="form-control"
                placeholder="Your password" value={form.password}
                onChange={handleChange} required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
