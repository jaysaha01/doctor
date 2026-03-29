import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../api/doctors";

const SPECIALIZATIONS = ["All", "Cardiologist", "Dermatologist", "Neurologist", "Orthopedist", "Pediatrician"];

function DoctorCard({ doctor }) {
  const initials = doctor.name.split(" ").slice(1).map((n) => n[0]).join("") || doctor.name[0];
  return (
    <div className="card doctor-card">
      <div className="card-body">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
          <div className="doctor-avatar">{initials}</div>
          <div className="doctor-info">
            <div className="doctor-name">{doctor.name}</div>
            <div className="doctor-spec">{doctor.specialization}</div>
            <div className="doctor-meta">
              <span>⭐ {doctor.rating}</span>
              <span>🎓 {doctor.experience} yrs exp</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Consultation Fee</div>
            <div className="doctor-fee">₹{doctor.fees}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>
              {doctor.availableSlots?.length || 0} slots available
            </div>
            <Link to={`/book/${doctor._id}`} className="btn btn-primary btn-sm">Book Appointment</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors", search, spec],
    queryFn: () => getDoctors({ search, specialization: spec === "All" ? "" : spec }).then((r) => r.data),
    staleTime: 30000,
  });

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Find Your Doctor</h1>
          <p>Browse our network of top-rated specialists and book an appointment instantly.</p>
        </div>
      </div>
      <div className="container page">
        <div className="search-bar">
          <input
            type="text" className="form-control" placeholder="🔍  Search by name or specialization…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-control" style={{ maxWidth: 220 }} value={spec} onChange={(e) => setSpec(e.target.value)}>
            {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {isLoading && <div className="spinner-wrap"><div className="spinner"></div></div>}
        {error && <div className="alert alert-error">Failed to load doctors.</div>}

        {data && (
          <>
            <p style={{ marginBottom: 20, color: "var(--text-muted)", fontWeight: 600 }}>
              {data.count} doctor{data.count !== 1 ? "s" : ""} found
            </p>
            {data.doctors.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No doctors found</h3>
                <p>Try a different search term or specialization.</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {data.doctors.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
