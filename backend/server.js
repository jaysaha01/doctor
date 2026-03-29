const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

app.use(cors())
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", doctorRoutes);
app.use("/api", appointmentRoutes);


app.get("/", (req, res) => res.json({ message: "Doctor Appointment API is running" }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 6000;

mongoose
  .connect("mongodb+srv://sahajay426_db_user:SA44WUHDiRhOYYHC@cluster0.kgf1ufw.mongodb.net/")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
