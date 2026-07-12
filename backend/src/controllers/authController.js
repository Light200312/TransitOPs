const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const {sendEmail , resetPasswordMail} = require("../utils/mail.js") ;


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
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user with this email exists" })
    }

    const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user?.email,
      subject: "Request to change password",
      mailgenContent: resetPasswordMail(
        user?.name,
        `http://localhost:5173/resetPassword/${unHashedToken}`
      )
    });

    return res.status(200).json({ message: "Email sent" });


  } catch (error) {
    return res.status(401).json({ message: `Error : ${error}` })
  }
}

const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Enter same password" })
  }

  const newHash = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: newHash,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) { return res.status(400).json({ message: "Time limit exceeded , Please try again" }) }

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      { message: "Password reset succesfully" }
    )

}

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

module.exports = { register, login, getMe , forgetPassword , resetPassword };
