const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router.use(protect);

router.route("/")
  .get(getVehicles)
  .post(authorize("Fleet Manager"), createVehicle);

router.route("/:id")
  .get(getVehicleById)
  .put(authorize("Fleet Manager"), updateVehicle)
  .delete(authorize("Fleet Manager"), deleteVehicle);

module.exports = router;
