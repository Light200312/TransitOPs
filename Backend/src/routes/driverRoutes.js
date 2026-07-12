const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");

router.use(protect);

router.route("/")
  .get(getDrivers)
  .post(authorize("Fleet Manager", "Safety Officer"), createDriver);

router.route("/:id")
  .get(getDriverById)
  .put(authorize("Fleet Manager", "Safety Officer"), updateDriver)
  .delete(authorize("Fleet Manager"), deleteDriver);

module.exports = router;
