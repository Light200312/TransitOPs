const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

/**
 * Generate the next sequential trip ID.
 */
const generateTripId = async () => {
  const last = await Trip.findOne().sort({ createdAt: -1 });
  if (!last || !last.tripId) return "TRP-24081";
  const num = parseInt(last.tripId.replace("TRP-", ""), 10);
  return `TRP-${String(num + 1).padStart(5, "0")}`;
};

/**
 * GET /api/trips
 * List all trips. Populates vehicle and driver refs.
 */
const getTrips = async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;

  const trips = await Trip.find(filter)
    .populate("vehicle", "regNo model capacity status")
    .populate("driver", "name license category status")
    .sort({ createdAt: -1 });

  res.json(trips);
};

/**
 * GET /api/trips/:id
 */
const getTripById = async (req, res) => {
  const trip = await Trip.findById(req.params.id)
    .populate("vehicle")
    .populate("driver");
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  res.json(trip);
};

/**
 * POST /api/trips
 * Create a new trip and dispatch it.
 * Enforces all mandatory business rules:
 *   - Vehicle must be Available (not Retired, In Shop, or On Trip)
 *   - Driver must be Available with a valid (non-expired) license, not Suspended
 *   - Cargo weight must not exceed vehicle capacity
 *   - Automatically sets vehicle & driver status to "On Trip"
 */
const createTrip = async (req, res) => {
  const { source, destination, vehicleId, driverId, cargo, distance } = req.body;

  // --- Validate vehicle ---
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  if (vehicle.status === "Retired" || vehicle.status === "In Shop") {
    return res.status(400).json({
      message: `Vehicle ${vehicle.regNo} is ${vehicle.status} and cannot be dispatched.`,
    });
  }
  if (vehicle.status === "On Trip") {
    return res.status(400).json({
      message: `Vehicle ${vehicle.regNo} is already On Trip.`,
    });
  }

  // --- Validate driver ---
  const driver = await Driver.findById(driverId);
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }
  if (driver.status === "Suspended") {
    return res.status(400).json({
      message: `Driver ${driver.name} is Suspended and cannot be assigned.`,
    });
  }
  if (driver.status === "On Trip") {
    return res.status(400).json({
      message: `Driver ${driver.name} is already On Trip.`,
    });
  }
  // Check license expiry
  if (new Date(driver.expiry) < new Date()) {
    return res.status(400).json({
      message: `Driver ${driver.name}'s license has expired (${driver.expiry.toISOString().split("T")[0]}).`,
    });
  }

  // --- Validate cargo weight ---
  const cargoNum = Number(cargo);
  if (cargoNum > vehicle.capacity) {
    return res.status(400).json({
      message: `Cargo (${cargoNum} kg) exceeds vehicle ${vehicle.regNo}'s capacity (${vehicle.capacity} kg).`,
    });
  }

  // --- Create trip ---
  const tripId = await generateTripId();
  const trip = await Trip.create({
    tripId,
    source,
    destination,
    vehicle: vehicleId,
    driver: driverId,
    status: "Dispatched",
    eta: "Today, 20:15",
    cargo: cargoNum,
    distance: Number(distance),
  });

  // --- Auto status transition: vehicle & driver → On Trip ---
  vehicle.status = "On Trip";
  driver.status = "On Trip";
  await vehicle.save();
  await driver.save();

  const populated = await Trip.findById(trip._id)
    .populate("vehicle", "regNo model capacity status")
    .populate("driver", "name license category status");

  res.status(201).json(populated);
};

/**
 * PATCH /api/trips/:id/complete
 * Mark trip as Completed. Restores vehicle & driver to Available.
 */
const completeTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (trip.status !== "Dispatched") {
    return res.status(400).json({ message: "Only dispatched trips can be completed." });
  }

  trip.status = "Completed";
  trip.eta = "Completed today";

  // Optional: accept final odometer & fuel consumed from request body
  if (req.body.finalOdometer) trip.finalOdometer = Number(req.body.finalOdometer);
  if (req.body.fuelConsumed) trip.fuelConsumed = Number(req.body.fuelConsumed);

  await trip.save();

  // Restore vehicle & driver to Available
  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  if (vehicle && vehicle.status === "On Trip") {
    vehicle.status = "Available";
    if (req.body.finalOdometer) vehicle.odometer = Number(req.body.finalOdometer);
    await vehicle.save();
  }
  if (driver && driver.status === "On Trip") {
    driver.status = "Available";
    await driver.save();
  }

  const populated = await Trip.findById(trip._id)
    .populate("vehicle", "regNo model capacity status")
    .populate("driver", "name license category status");

  res.json(populated);
};

/**
 * PATCH /api/trips/:id/cancel
 * Cancel a dispatched trip. Restores vehicle & driver to Available.
 */
const cancelTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (trip.status !== "Dispatched") {
    return res.status(400).json({ message: "Only dispatched trips can be cancelled." });
  }

  trip.status = "Cancelled";
  trip.eta = "Dispatch cancelled";
  await trip.save();

  // Restore vehicle & driver
  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  if (vehicle && vehicle.status === "On Trip") {
    vehicle.status = "Available";
    await vehicle.save();
  }
  if (driver && driver.status === "On Trip") {
    driver.status = "Available";
    await driver.save();
  }

  const populated = await Trip.findById(trip._id)
    .populate("vehicle", "regNo model capacity status")
    .populate("driver", "name license category status");

  res.json(populated);
};

module.exports = { getTrips, getTripById, createTrip, completeTrip, cancelTrip };
