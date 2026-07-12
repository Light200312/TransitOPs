const mongoose = require("mongoose");

const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
const LICENSE_CATEGORIES = ["HMV", "LMV"];

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    license: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: LICENSE_CATEGORIES,
      default: "LMV",
    },
    expiry: {
      type: Date,
      required: [true, "License expiry date is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    completion: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    safety: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: DRIVER_STATUSES,
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
module.exports.DRIVER_STATUSES = DRIVER_STATUSES;
