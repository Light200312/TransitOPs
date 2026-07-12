const express = require("express");
const router = express.Router();
const { register, login, getMe, getCompanies } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/companies", getCompanies);

module.exports = router;
