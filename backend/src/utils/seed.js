/**
 * Seed script — populates the MongoDB database with initial TransitOps data
 * matching the frontend's seed.js.
 *
 * Usage:  npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../DB/db");

const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");

const seed = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Vehicle.deleteMany(),
    Driver.deleteMany(),
    Trip.deleteMany(),
    Maintenance.deleteMany(),
    FuelLog.deleteMany(),
    Expense.deleteMany(),
  ]);

  // ---- Users ----
  const users = await User.create([
    { name: "Priya Desai", email: "ops@transitops.in", password: "transit123", role: "Fleet Manager" },
    { name: "Aarav Mehta", email: "dispatcher@transitops.in", password: "transit123", role: "Dispatcher" },
    { name: "Neha Shah", email: "safety@transitops.in", password: "transit123", role: "Safety Officer" },
    { name: "Vikram Joshi", email: "finance@transitops.in", password: "transit123", role: "Financial Analyst" },
    { name: "Rakesh Patel", email: "driver@transitops.in", password: "transit123", role: "Driver" },
  ]);
  console.log(`  ✅ ${users.length} users created`);

  // ---- Vehicles ----
  const vehicles = await Vehicle.create([
    { regNo: "GJ-01-KP-4821", model: "Tata Prima 5530", type: "Truck", capacity: 18000, odometer: 128430, cost: 2850000, status: "On Trip", region: "Ahmedabad Hub" },
    { regNo: "GJ-18-AT-9034", model: "Mahindra Blazo X", type: "Truck", capacity: 12000, odometer: 84560, cost: 2120000, status: "Available", region: "Gandhinagar Depot" },
    { regNo: "GJ-01-RX-2190", model: "Tata Ace Gold", type: "Mini", capacity: 750, odometer: 41820, cost: 585000, status: "Available", region: "Kalol Depot" },
    { regNo: "GJ-27-MN-5518", model: "Eicher Pro 2049", type: "Truck", capacity: 6000, odometer: 102900, cost: 1490000, status: "In Shop", region: "Ahmedabad Hub" },
    { regNo: "GJ-01-VB-7724", model: "Force Traveller", type: "Van", capacity: 1400, odometer: 64300, cost: 890000, status: "Available", region: "Gandhinagar Depot" },
    { regNo: "GJ-18-PE-3320", model: "Ashok Leyland Dost", type: "Mini", capacity: 1250, odometer: 178200, cost: 530000, status: "Retired", region: "Kalol Depot" },
  ]);
  console.log(`  ✅ ${vehicles.length} vehicles created`);

  // ---- Drivers ----
  const drivers = await Driver.create([
    { name: "Rakesh Patel", license: "GJ-01-20120219876", category: "HMV", expiry: "2028-04-11", contact: "+91 98254 11872", completion: 98, safety: 94, status: "On Trip" },
    { name: "Nitin Shah", license: "GJ-18-20150644210", category: "HMV", expiry: "2027-09-23", contact: "+91 99041 88413", completion: 96, safety: 91, status: "Available" },
    { name: "Jignesh Prajapati", license: "GJ-01-20180990841", category: "LMV", expiry: "2026-11-18", contact: "+91 98989 45231", completion: 93, safety: 88, status: "Available" },
    { name: "Kiran Solanki", license: "GJ-27-20140433211", category: "HMV", expiry: "2025-02-09", contact: "+91 97248 90672", completion: 87, safety: 72, status: "Suspended" },
    { name: "Mahesh Vaghela", license: "GJ-18-20161344562", category: "LMV", expiry: "2027-01-05", contact: "+91 98791 31026", completion: 91, safety: 84, status: "Off Duty" },
    { name: "Vikram Singh", license: "GJ-01-20190566321", category: "HMV", expiry: "2029-08-22", contact: "+91 99042 11234", completion: 99, safety: 97, status: "Available" },
    { name: "Amit Desai", license: "GJ-27-20150899441", category: "LMV", expiry: "2025-05-10", contact: "+91 97241 88765", completion: 85, safety: 78, status: "Off Duty" },
    { name: "Sanjay Joshi", license: "GJ-18-20220133980", category: "HMV", expiry: "2030-01-15", contact: "+91 98980 66543", completion: 94, safety: 92, status: "On Trip" },
    { name: "Deepak Chauhan", license: "GJ-01-20170788123", category: "HMV", expiry: "2028-12-01", contact: "+91 98765 43210", completion: 96, safety: 90, status: "Available" },
    { name: "Harish Rathod", license: "GJ-27-20130255674", category: "HMV", expiry: "2027-06-30", contact: "+91 99120 55678", completion: 89, safety: 81, status: "On Trip" },
    { name: "Pranav Trivedi", license: "GJ-18-20200411298", category: "LMV", expiry: "2029-03-14", contact: "+91 97890 12345", completion: 92, safety: 89, status: "Available" },
    { name: "Bhavesh Makwana", license: "GJ-01-20160977541", category: "HMV", expiry: "2026-08-20", contact: "+91 98410 77890", completion: 88, safety: 76, status: "Suspended" },
    { name: "Rajesh Parmar", license: "GJ-27-20210344567", category: "LMV", expiry: "2030-11-05", contact: "+91 99870 33456", completion: 95, safety: 93, status: "Off Duty" },
    { name: "Suresh Gohel", license: "GJ-18-20190622890", category: "HMV", expiry: "2028-07-18", contact: "+91 98230 99876", completion: 90, safety: 85, status: "Available" },
  ]);
  console.log(`  ✅ ${drivers.length} drivers created`);

  // ---- Trips ----
  const trips = await Trip.create([
    { tripId: "TRP-24081", source: "Ahmedabad Hub", destination: "Vadodara DC", vehicle: vehicles[0]._id, driver: drivers[0]._id, status: "Dispatched", eta: "Today, 18:40", cargo: 14200, distance: 112 },
    { tripId: "TRP-24080", source: "Gandhinagar Depot", destination: "Mehsana", vehicle: vehicles[1]._id, driver: drivers[1]._id, status: "Draft", eta: "Awaiting dispatch", cargo: 8000, distance: 76 },
    { tripId: "TRP-24079", source: "Kalol Depot", destination: "Sanand", vehicle: vehicles[2]._id, driver: drivers[2]._id, status: "Completed", eta: "Today, 11:20", cargo: 620, distance: 48 },
    { tripId: "TRP-24078", source: "Ahmedabad Hub", destination: "Surat DC", vehicle: vehicles[3]._id, driver: drivers[3]._id, status: "Cancelled", eta: "Vehicle maintenance", cargo: 5000, distance: 267 },
  ]);
  console.log(`  ✅ ${trips.length} trips created`);

  // ---- Maintenance ----
  const maintenance = await Maintenance.create([
    { vehicle: vehicles[3]._id, service: "Brake system overhaul", cost: 28600, date: "2026-07-10", status: "In Shop" },
    { vehicle: vehicles[0]._id, service: "Scheduled oil service", cost: 9800, date: "2026-07-02", status: "Completed" },
    { vehicle: vehicles[4]._id, service: "Tyre rotation", cost: 4200, date: "2026-06-28", status: "Completed" },
  ]);
  console.log(`  ✅ ${maintenance.length} maintenance logs created`);

  // ---- Fuel Logs ----
  const fuelLogs = await FuelLog.create([
    { vehicle: vehicles[0]._id, date: "2026-07-11", liters: 182, cost: 17560 },
    { vehicle: vehicles[1]._id, date: "2026-07-10", liters: 132, cost: 12738 },
    { vehicle: vehicles[2]._id, date: "2026-07-09", liters: 32, cost: 3091 },
  ]);
  console.log(`  ✅ ${fuelLogs.length} fuel logs created`);

  // ---- Expenses ----
  const expenses = await Expense.create([
    { trip: trips[0]._id, vehicle: vehicles[0]._id, toll: 1120, other: 450, maintenance: 0, status: "Pending" },
    { trip: trips[2]._id, vehicle: vehicles[2]._id, toll: 240, other: 180, maintenance: 4200, status: "Completed" },
  ]);
  console.log(`  ✅ ${expenses.length} expenses created`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("   Email: ops@transitops.in  |  Password: transit123  |  Role: Fleet Manager");
  console.log("   Email: dispatcher@transitops.in  |  Password: transit123  |  Role: Dispatcher");
  console.log("   Email: safety@transitops.in  |  Password: transit123  |  Role: Safety Officer");
  console.log("   Email: finance@transitops.in  |  Password: transit123  |  Role: Financial Analyst");
  console.log("   Email: driver@transitops.in  |  Password: transit123  |  Role: Driver");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
