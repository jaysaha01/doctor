import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data.token, data.user);
      addToast("Account created! Check your email to verify.", "success");
      navigate("/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join MediBook</h1>
          <p>Create your account to get started</p>
        </div>
        <div className="card auth-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="Dr. / Mr. / Ms." value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
