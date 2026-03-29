const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

const sendVerificationEmail = async (user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: `"MediBook" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email - MediBook",
      html: `
        <h2>Welcome to MediBook, ${user.name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}" style="background:#4f46e5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};

// POST /api/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      name, email, password,
      role: role === "admin" ? "admin" : "user",
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      message: "Registered successfully. Check your email to verify your account.",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/verify-email?token=...
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
