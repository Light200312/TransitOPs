const Vehicle = require("../models/Vehicle");

/**
 * GET /api/vehicles
 * List all vehicles. Supports query filters: type, status, region, search.
 */
const getVehicles = async (req, res) => {
  const { type, status, region, search } = req.query;
  const filter = {};

  if (type && type !== "All") filter.type = type;
  if (status && status !== "All") filter.status = status;
  if (region && region !== "All") filter.region = region;
  if (search) {
    filter.$or = [
      { regNo: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }

  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
  res.json(vehicles);
};

/**
 * GET /api/vehicles/:id
 * Get a single vehicle by its MongoDB _id.
 */
const getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  res.json(vehicle);
};

/**
 * POST /api/vehicles
 * Register a new vehicle. Registration number must be unique.
 */
const createVehicle = async (req, res) => {
  const { regNo, model, type, capacity, odometer, cost, status, region } = req.body;

  // Check uniqueness
  const exists = await Vehicle.findOne({ regNo: regNo.trim().toUpperCase() });
  if (exists) {
    return res
      .status(409)
      .json({ message: "This registration number already exists. Registration numbers must be unique." });
  }

  const vehicle = await Vehicle.create({
    regNo: regNo.trim().toUpperCase(),
    model,
    type,
    capacity: Number(capacity),
    odometer: Number(odometer),
    cost: Number(cost),
    status: status || "Available",
    region: region || "Ahmedabad Hub",
  });

  res.status(201).json(vehicle);
};

/**
 * PUT /api/vehicles/:id
 * Update a vehicle's details.
 */
const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  // If changing regNo, check uniqueness
  if (req.body.regNo && req.body.regNo.trim().toUpperCase() !== vehicle.regNo) {
    const exists = await Vehicle.findOne({ regNo: req.body.regNo.trim().toUpperCase() });
    if (exists) {
      return res.status(409).json({ message: "Registration number already in use" });
    }
  }

  const updatableFields = ["regNo", "model", "type", "capacity", "odometer", "cost", "status", "region"];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      vehicle[field] = field === "regNo" ? req.body[field].trim().toUpperCase() : req.body[field];
    }
  });

  const updated = await vehicle.save();
  res.json(updated);
};

/**
 * DELETE /api/vehicles/:id
 * Remove a vehicle from the registry.
 */
const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }
  await vehicle.deleteOne();
  res.json({ message: "Vehicle removed" });
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
