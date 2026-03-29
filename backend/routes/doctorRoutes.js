const express = require("express");
const router = express.Router();
const { getDoctors, getDoctorById } = require("../controllers/doctorController");

router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);

module.exports = router;
