import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAppointments, cancelAppointment } from "../api/appointments";
import { useToast } from "../components/Toast";

export default function AdminPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-appointments", filterStatus],
    queryFn: () => getAllAppointments({ status: filterStatus }).then((r) => r.data),
    staleTime: 10000,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      addToast("Appointment cancelled by admin.", "success");
      queryClient.invalidateQueries(["all-appointments"]);
    },
    onError: (err) => addToast(err.response?.data?.message || "Error.", "error"),
  });

  const appointments = data?.appointments || [];
  const booked = appointments.filter((a) => a.status === "booked").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>View and manage all appointments across the platform</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{data?.count ?? "—"}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-number">{booked}</div>
          <div className="stat-label">Active Bookings</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-number">{cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 12 }}>
        <label style={{ fontWeight: 600, fontSize: "0.88rem", alignSelf: "center" }}>Filter:</label>
        <select className="form-control" style={{ maxWidth: 180 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading && <div className="spinner-wrap"><div className="spinner"></div></div>}
      {error && <div className="alert alert-error">Failed to load appointments.</div>}

      {!isLoading && appointments.length === 0 && (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No appointments found</h3>
        </div>
      )}

      {appointments.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => (
                <tr key={appt._id}>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.userId?.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{appt.userId?.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{appt.doctorId?.name}</td>
                  <td>
                    <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.82rem" }}>
                      {appt.doctorId?.specialization}
                    </span>
                  </td>
                  <td>
                    {appt.date
                      ? new Date(appt.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td>{appt.time}</td>
                  <td>₹{appt.doctorId?.fees}</td>
                  <td><span className={`badge badge-${appt.status}`}>{appt.status}</span></td>
                  <td>
                    {appt.status === "booked" && (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={cancelMutation.isPending}
                        onClick={() => {
                          if (window.confirm("Cancel this appointment?")) cancelMutation.mutate(appt._id);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
