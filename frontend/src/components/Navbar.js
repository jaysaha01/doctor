import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Medi<span>Book</span>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <NavLink to="/doctors" className="nav-link">
              <span>Doctors</span>
            </NavLink>
            <NavLink to="/my-appointments" className="nav-link">
              <span>My Bookings</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="nav-link">
                <span>Admin</span>
                <span className="nav-badge">admin</span>
              </NavLink>
            )}
            <span style={{ color: "rgba(255,255,255,0.5)", margin: "0 4px" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", marginRight: 4 }}>
              {user.name?.split(" ")[0]}
            </span>
            <button className="btn btn-outline btn-sm" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link"><span>Login</span></NavLink>
            <Link to="/register" className="btn btn-accent btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
