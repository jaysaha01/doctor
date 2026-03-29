import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyAppointments, cancelAppointment } from "../api/appointments";
import { useToast } from "../components/Toast";

function AppointmentCard({ appt, onCancel }) {
  const doc = appt.doctorId;
  const initials = doc?.name?.split(" ").slice(1).map((n) => n[0]).join("") || "D";
  const dateStr = appt.date
    ? new Date(appt.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className={`card appt-card ${appt.status}`}>
      <div className="card-body">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div className="doctor-avatar" style={{ width: 56, height: 56, fontSize: "1.2rem" }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div className="doctor-name" style={{ fontSize: "1.05rem" }}>{doc?.name}</div>
                <div className="doctor-spec">{doc?.specialization}</div>
              </div>
              <span className={`badge badge-${appt.status}`}>{appt.status}</span>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Date</div>
                <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>📅 {dateStr}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Time</div>
                <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>🕐 {appt.time}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Fee</div>
                <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>₹{doc?.fees}</div>
              </div>
            </div>
            {appt.notes && (
              <div style={{ marginTop: 10, fontSize: "0.88rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                "{appt.notes}"
              </div>
            )}
          </div>
        </div>
        {appt.status === "booked" && (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(appt._id)}>
              Cancel Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => getMyAppointments().then((r) => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      addToast("Appointment cancelled.", "success");
      queryClient.invalidateQueries(["my-appointments"]);
    },
    onError: (err) => addToast(err.response?.data?.message || "Cancel failed.", "error"),
  });

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelMutation.mutate(id);
    }
  };

  const booked = data?.appointments?.filter((a) => a.status === "booked") || [];
  const cancelled = data?.appointments?.filter((a) => a.status === "cancelled") || [];

  return (
    <div className="container page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>My Appointments</h1>
          <p>Track and manage all your bookings</p>
        </div>
        <Link to="/doctors" className="btn btn-primary">+ Book New</Link>
      </div>

      {isLoading && <div className="spinner-wrap"><div className="spinner"></div></div>}
      {error && <div className="alert alert-error">Failed to load appointments.</div>}

      {data && data.appointments.length === 0 && (
        <div className="empty-state">
          <div className="icon">📅</div>
          <h3>No appointments yet</h3>
          <p>Browse our doctors and book your first appointment.</p>
          <Link to="/doctors" className="btn btn-primary" style={{ marginTop: 20 }}>Find Doctors</Link>
        </div>
      )}

      {booked.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ marginBottom: 16, color: "var(--primary-dark)" }}>Upcoming ({booked.length})</h3>
          <div className="grid grid-2">
            {booked.map((a) => <AppointmentCard key={a._id} appt={a} onCancel={handleCancel} />)}
          </div>
        </div>
      )}

      {cancelled.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 16, color: "var(--text-muted)" }}>Cancelled ({cancelled.length})</h3>
          <div className="grid grid-2">
            {cancelled.map((a) => <AppointmentCard key={a._id} appt={a} onCancel={handleCancel} />)}
          </div>
        </div>
      )}
    </div>
  );
}
