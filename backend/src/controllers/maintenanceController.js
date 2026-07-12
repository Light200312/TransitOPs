const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

const getMaintenanceLogs = async (req, res) => {
  const logs = await Maintenance.find()
    .populate("vehicle", "regNo model status")
    .sort({ createdAt: -1 });
  res.json(logs);
};

const createMaintenance = async (req, res) => {
  const { vehicleId, service, cost, status } = req.body;
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  if (vehicle.status === "Retired")
    return res.status(400).json({ message: "Cannot create maintenance for a retired vehicle." });

  const maintenanceStatus = status || "In Shop";
  const log = await Maintenance.create({
    vehicle: vehicleId, service, cost: Number(cost), date: new Date(), status: maintenanceStatus,
  });

  if (maintenanceStatus === "In Shop") {
    vehicle.status = "In Shop";
    await vehicle.save();
  }

  const populated = await Maintenance.findById(log._id).populate("vehicle", "regNo model status");
  res.status(201).json(populated);
};

const closeMaintenance = async (req, res) => {
  const log = await Maintenance.findById(req.params.id);
  if (!log) return res.status(404).json({ message: "Maintenance record not found" });
  if (log.status === "Completed")
    return res.status(400).json({ message: "Already completed." });

  log.status = "Completed";
  await log.save();

  const vehicle = await Vehicle.findById(log.vehicle);
  if (vehicle && vehicle.status !== "Retired") {
    vehicle.status = "Available";
    await vehicle.save();
  }

  const populated = await Maintenance.findById(log._id).populate("vehicle", "regNo model status");
  res.json(populated);
};

module.exports = { getMaintenanceLogs, createMaintenance, closeMaintenance };
