const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/appointments", protect, bookAppointment);
router.get("/my-appointments", protect, getMyAppointments);
router.get("/all-appointments", protect, adminOnly, getAllAppointments);
router.patch("/appointments/:id/cancel", protect, cancelAppointment);

module.exports = router;
