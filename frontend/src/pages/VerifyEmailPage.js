import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setStatus("error"); setMessage("No verification token found."); return; }
    verifyEmail(token)
      .then((r) => { setStatus("success"); setMessage(r.data.message); })
      .catch((err) => { setStatus("error"); setMessage(err.response?.data?.message || "Verification failed."); });
  }, [params]);

  return (
    <div className="auth-page">
      <div className="card" style={{ maxWidth: 440, width: "100%", padding: 48, textAlign: "center" }}>
        {status === "verifying" && (
          <><div className="spinner" style={{ margin: "0 auto 20px" }}></div><p>Verifying your email…</p></>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ marginBottom: 8 }}>Email Verified!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{message}</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>❌</div>
            <h2 style={{ marginBottom: 8 }}>Verification Failed</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{message}</p>
            <Link to="/register" className="btn btn-outline">Try Again</Link>
          </>
        )}
      </div>
    </div>
  );
}
