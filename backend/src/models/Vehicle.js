const mongoose = require("mongoose");

const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];
const VEHICLE_TYPES = ["Truck", "Van", "Mini"];

const vehicleSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Vehicle model/name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: VEHICLE_TYPES,
      default: "Truck",
    },
    capacity: {
      type: Number,
      required: [true, "Maximum load capacity (kg) is required"],
      min: [0, "Capacity cannot be negative"],
    },
    odometer: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    cost: {
      type: Number,
      required: [true, "Acquisition cost is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: VEHICLE_STATUSES,
      default: "Available",
    },
    region: {
      type: String,
      default: "Ahmedabad Hub",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
module.exports.VEHICLE_STATUSES = VEHICLE_STATUSES;
module.exports.VEHICLE_TYPES = VEHICLE_TYPES;
