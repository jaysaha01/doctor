const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
require("dotenv").config({ path: "../.env" });

const generateSlots = () => {
  const slots = [];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const dateStr = date.toISOString().split("T")[0];
      times.forEach((time) => slots.push({ date: dateStr, time }));
    }
  }
  return slots;
};

const doctors = [
  { name: "Dr. Priya Sharma", specialization: "Cardiologist", fees: 800, experience: 12, rating: 4.8 },
  { name: "Dr. Rahul Mehta", specialization: "Dermatologist", fees: 600, experience: 8, rating: 4.6 },
  { name: "Dr. Ananya Bose", specialization: "Neurologist", fees: 1000, experience: 15, rating: 4.9 },
  { name: "Dr. Vikram Patel", specialization: "Orthopedist", fees: 700, experience: 10, rating: 4.7 },
  { name: "Dr. Sunita Rao", specialization: "Pediatrician", fees: 500, experience: 9, rating: 4.8 },
];

const seed = async () => {
  try {
    await mongoose.connect('mongodb+srv://sahajay426_db_user:SA44WUHDiRhOYYHC@cluster0.kgf1ufw.mongodb.net/');
    await Doctor.deleteMany({});
    const seeded = await Doctor.insertMany(
      doctors.map((d) => ({ ...d, availableSlots: generateSlots() }))
    );
    console.log(`✅ Seeded ${seeded.length} doctors successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
