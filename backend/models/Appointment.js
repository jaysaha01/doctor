const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },  // "YYYY-MM-DD"
    time: { type: String, required: true },  // "HH:MM"
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index to prevent double-booking
appointmentSchema.index(
  { doctorId: 1, date: 1, time: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "booked" },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
