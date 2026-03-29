import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDoctorById } from "../api/doctors";
import { bookAppointment } from "../api/appointments";
import { useToast } from "../components/Toast";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id).then((r) => r.data.doctor),
  });

  const availableDates = useMemo(() => {
    if (!data) return [];
    const dates = [...new Set(data.availableSlots.map((s) => s.date))].sort();
    return dates;
  }, [data]);

  const slotsForDate = useMemo(() => {
    if (!data || !selectedDate) return [];
    return data.availableSlots.filter((s) => s.date === selectedDate).map((s) => s.time).sort();
  }, [data, selectedDate]);

  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      addToast("Appointment booked successfully! 🎉", "success");
      queryClient.invalidateQueries(["my-appointments"]);
      navigate("/my-appointments");
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Booking failed.", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return addToast("Please select a date and time.", "error");
    mutation.mutate({ doctorId: id, date: selectedDate, time: selectedTime, notes });
  };

  if (isLoading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (error) return <div className="container page"><div className="alert alert-error">Failed to load doctor details.</div></div>;

  const doctor = data;
  const initials = doctor.name.split(" ").slice(1).map((n) => n[0]).join("") || doctor.name[0];

  return (
    <div className="container page">
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>← Back</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Doctor Info */}
        <div className="card card-body">
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
            <div className="doctor-avatar" style={{ width: 88, height: 88, fontSize: "2rem" }}>{initials}</div>
            <div>
              <div className="doctor-name" style={{ fontSize: "1.4rem" }}>{doctor.name}</div>
              <div className="doctor-spec">{doctor.specialization}</div>
              <div className="doctor-meta">
                <span>⭐ {doctor.rating}</span>
                <span>🎓 {doctor.experience} yrs</span>
              </div>
            </div>
          </div>
          <div style={{ background: "var(--bg)", borderRadius: "var(--radius-sm)", padding: 16 }}>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Consultation Fee</div>
            <div style={{ fontSize: "1.8rem", fontFamily: "var(--font-heading)", color: "var(--primary-dark)" }}>₹{doctor.fees}</div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="card card-body">
          <h2 style={{ marginBottom: 24, fontSize: "1.4rem" }}>Select Appointment Slot</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Date</label>
              <select
                className="form-control"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                required
              >
                <option value="">-- Choose a date --</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div className="form-group">
                <label className="form-label">Select Time Slot</label>
                {slotsForDate.length === 0 ? (
                  <div className="alert alert-info">No slots available for this date.</div>
                ) : (
                  <div className="slot-grid">
                    {slotsForDate.map((time) => (
                      <button
                        key={time} type="button"
                        className={`slot-btn ${selectedTime === time ? "selected" : ""}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-control" rows={3}
                placeholder="Describe your symptoms or reason for visit…"
                value={notes} onChange={(e) => setNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            {selectedDate && selectedTime && (
              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                📅 Booking: <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</strong> at <strong>{selectedTime}</strong>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={mutation.isPending || !selectedDate || !selectedTime}>
              {mutation.isPending ? "Booking…" : "Confirm Appointment →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
