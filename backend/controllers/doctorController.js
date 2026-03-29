const Doctor = require("../models/Doctor");

// GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    const doctors = await Doctor.find(query).select("-__v");
    res.json({ doctors, count: doctors.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
