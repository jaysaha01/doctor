const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    if (!doctorId || !date || !time)
      return res.status(400).json({ message: "doctorId, date, and time are required" });

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Validate slot exists on doctor
    const slotExists = doctor.availableSlots.some((s) => s.date === date && s.time === time);
    if (!slotExists)
      return res.status(400).json({ message: "Selected slot is not available for this doctor" });

    // Check double booking
    const existing = await Appointment.findOne({ doctorId, date, time, status: "booked" });
    if (existing)
      return res.status(409).json({ message: "This slot is already booked. Please choose another time." });

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date,
      time,
      notes: notes || "",
    });

    await appointment.populate([
      { path: "doctorId", select: "name specialization fees" },
      { path: "userId", select: "name email" },
    ]);

    res.status(201).json({ message: "Appointment booked successfully!", appointment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This slot is already booked. Please choose another time." });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/my-appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "name specialization fees image")
      .sort({ createdAt: -1 });

    res.json({ appointments, count: appointments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/all-appointments (admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    if (status) query.status = status;
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate("userId", "name email")
      .populate("doctorId", "name specialization fees")
      .sort({ createdAt: -1 });

    res.json({ appointments, count: appointments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Only owner or admin can cancel
    if (
      appointment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    if (appointment.status === "cancelled")
      return res.status(400).json({ message: "Appointment is already cancelled" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
