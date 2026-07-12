const Driver = require("../models/Driver");

/**
 * GET /api/drivers
 * List all drivers. Supports query filters: status, search.
 */
const getDrivers = async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== "All") filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { license: { $regex: search, $options: "i" } },
    ];
  }

  const drivers = await Driver.find(filter).sort({ createdAt: -1 });
  res.json(drivers);
};

/**
 * GET /api/drivers/:id
 * Get a single driver by _id.
 */
const getDriverById = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }
  res.json(driver);
};

/**
 * POST /api/drivers
 * Register a new driver. License must be unique.
 */
const createDriver = async (req, res) => {
  const { name, license, category, expiry, contact, completion, safety, status } = req.body;

  const exists = await Driver.findOne({ license: license.trim() });
  if (exists) {
    return res.status(409).json({ message: "A driver with this license number already exists" });
  }

  const driver = await Driver.create({
    name,
    license: license.trim(),
    category: category || "LMV",
    expiry,
    contact,
    completion: completion ?? 100,
    safety: safety ?? 100,
    status: status || "Available",
  });

  res.status(201).json(driver);
};

/**
 * PUT /api/drivers/:id
 * Update driver details.
 */
const updateDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  const updatableFields = ["name", "license", "category", "expiry", "contact", "completion", "safety", "status"];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      driver[field] = req.body[field];
    }
  });

  const updated = await driver.save();
  res.json(updated);
};

/**
 * DELETE /api/drivers/:id
 */
const deleteDriver = async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }
  await driver.deleteOne();
  res.json({ message: "Driver removed" });
};

module.exports = { getDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
