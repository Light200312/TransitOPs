const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMaintenanceLogs,
  createMaintenance,
  closeMaintenance,
} = require("../controllers/maintenanceController");

router.use(protect);

router.route("/")
  .get(getMaintenanceLogs)
  .post(authorize("Fleet Manager"), createMaintenance);

router.patch("/:id/close", authorize("Fleet Manager"), closeMaintenance);

module.exports = router;
