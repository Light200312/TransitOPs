const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate a JWT for the given user id.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * POST /api/auth/register
 * Register a new user (for seeding / admin use).
 */
const register = async (req, res) => {
  const { name, email, password, role, companyName, companyLocation } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    companyName: companyName?.trim() || "",
    companyLocation: companyLocation?.trim() || "",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    companyLocation: user.companyLocation,
    token: generateToken(user._id),
  });
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT + role.
 */
const login = async (req, res) => {
  const { email, password, role, companyName, companyLocation } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // If a role is explicitly sent, update the user's role for this session
  // (frontend allows choosing a role at login)
  if (role && role !== user.role) {
    user.role = role;
  }

  if (companyName && companyName.trim()) {
    user.companyName = companyName.trim();
  }

  if (companyLocation && companyLocation.trim()) {
    user.companyLocation = companyLocation.trim();
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    companyLocation: user.companyLocation,
    token: generateToken(user._id),
  });
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 */
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    companyName: req.user.companyName,
    companyLocation: req.user.companyLocation,
  });
};

const getCompanies = async (req, res) => {
  const users = await User.find({
    role: 'Fleet Manager',
    companyName: { $exists: true, $ne: '' },
  })
    .select('companyName')
    .lean();

  const companies = [...new Set(users.map((user) => user.companyName).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  res.json(companies);
};

module.exports = { register, login, getMe, getCompanies };
