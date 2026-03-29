const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  time: { type: String, required: true }, // "HH:MM"
});

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    fees: { type: Number, required: true },
    image: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    availableSlots: [slotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
