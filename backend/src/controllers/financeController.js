const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");

/** POST /api/finance/fuel — Log fuel for a vehicle */
const createFuelLog = async (req, res) => {
  const { vehicleId, date, liters, cost } = req.body;
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  const log = await FuelLog.create({
    vehicle: vehicleId, date: date || new Date(), liters: Number(liters), cost: Number(cost),
  });
  const populated = await FuelLog.findById(log._id).populate("vehicle", "regNo model");
  res.status(201).json(populated);
};

/** GET /api/finance/fuel — List fuel logs */
const getFuelLogs = async (req, res) => {
  const logs = await FuelLog.find()
    .populate("vehicle", "regNo model")
    .sort({ date: -1 });
  res.json(logs);
};

/** POST /api/finance/expenses — Log an expense */
const createExpense = async (req, res) => {
  const { tripId, vehicleId, toll, other, maintenance, status } = req.body;
  const data = {
    vehicle: vehicleId,
    toll: Number(toll || 0),
    other: Number(other || 0),
    maintenance: Number(maintenance || 0),
    status: status || "Pending",
  };
  if (tripId) data.trip = tripId;

  const expense = await Expense.create(data);
  const populated = await Expense.findById(expense._id)
    .populate("vehicle", "regNo model")
    .populate("trip", "tripId");
  res.status(201).json(populated);
};

/** GET /api/finance/expenses — List expenses */
const getExpenses = async (req, res) => {
  const expenses = await Expense.find()
    .populate("vehicle", "regNo model")
    .populate("trip", "tripId")
    .sort({ createdAt: -1 });
  res.json(expenses);
};

/** GET /api/finance/analytics — Dashboard KPIs and analytics */
const getAnalytics = async (req, res) => {
  const vehicles = await Vehicle.find();
  const trips = await Trip.find();
  const fuelLogs = await FuelLog.find();
  const maintenanceLogs = await Maintenance.find();
  const expenses = await Expense.find();

  const activeVehicles = vehicles.filter((v) => v.status !== "Retired").length;
  const availableVehicles = vehicles.filter((v) => v.status === "Available").length;
  const inMaintenance = vehicles.filter((v) => v.status === "In Shop").length;
  const onTrip = vehicles.filter((v) => v.status === "On Trip").length;
  const totalFuelCost = fuelLogs.reduce((sum, l) => sum + l.cost, 0);
  const totalFuelLiters = fuelLogs.reduce((sum, l) => sum + l.liters, 0);
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, l) => sum + l.cost, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.toll + e.other + e.maintenance, 0);
  const totalDistance = trips.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.distance, 0);
  const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(1) : 0;
  const fleetUtilization = activeVehicles > 0 ? Math.round((onTrip / activeVehicles) * 100) : 0;
  const operationalCost = totalFuelCost + totalMaintenanceCost;

  res.json({
    kpis: {
      activeVehicles,
      availableVehicles,
      inMaintenance,
      activeTrips: trips.filter((t) => t.status === "Dispatched").length,
      pendingTrips: trips.filter((t) => t.status === "Draft").length,
      onTripVehicles: onTrip,
      totalVehicles: vehicles.length,
    },
    analytics: {
      fuelEfficiency,
      fleetUtilization,
      operationalCost,
      totalFuelCost,
      totalMaintenanceCost,
      totalExpenses,
      totalDistance,
    },
  });
};

module.exports = { createFuelLog, getFuelLogs, createExpense, getExpenses, getAnalytics };
