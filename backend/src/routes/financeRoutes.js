const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createFuelLog,
  getFuelLogs,
  createExpense,
  getExpenses,
  getAnalytics,
} = require("../controllers/financeController");

router.use(protect);

router.route("/fuel")
  .get(getFuelLogs)
  .post(authorize("Fleet Manager", "Financial Analyst"), createFuelLog);

router.route("/expenses")
  .get(getExpenses)
  .post(authorize("Fleet Manager", "Financial Analyst"), createExpense);

router.get("/analytics", getAnalytics);

module.exports = router;
