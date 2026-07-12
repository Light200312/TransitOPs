const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

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
  const { name, email, password, role, companyName, companyLocation, company } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  let companyRecord = null;
  if (role === "Fleet Manager") {
    const resolvedCompanyName = companyName?.trim();
    const resolvedLocation = companyLocation?.trim();

    if (!resolvedCompanyName) {
      return res.status(400).json({ message: "Company name is required for Fleet Manager" });
    }

    companyRecord = await Company.findOneAndUpdate(
      { name: resolvedCompanyName },
      { $set: { name: resolvedCompanyName, location: resolvedLocation || "" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else if (company?.trim()) {
    companyRecord = await Company.findOneAndUpdate(
      { name: company.trim() },
      { $set: { name: company.trim(), location: companyLocation?.trim() || "" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    company: companyRecord?._id || null,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: companyRecord ? { _id: companyRecord._id, name: companyRecord.name, location: companyRecord.location } : null,
    token: generateToken(user._id),
  });
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT + role.
 */
const login = async (req, res) => {
  const { email, password, role } = req.body;

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
    await user.save();
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
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
  });
};

const listCompanies = async (req, res) => {
  const companies = await Company.find({}).sort({ name: 1 }).lean();
  res.json(companies);
};

module.exports = { register, login, getMe, listCompanies };
