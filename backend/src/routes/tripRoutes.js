const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getTrips,
  getTripById,
  createTrip,
  completeTrip,
  cancelTrip,
} = require("../controllers/tripController");

router.use(protect);

router.route("/")
  .get(getTrips)
  .post(authorize("Fleet Manager", "Dispatcher"), createTrip);

router.get("/:id", getTripById);
router.patch("/:id/complete", authorize("Fleet Manager", "Dispatcher"), completeTrip);
router.patch("/:id/cancel", authorize("Fleet Manager", "Dispatcher"), cancelTrip);

module.exports = router;
