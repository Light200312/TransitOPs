const mongoose = require("mongoose");

const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];

const tripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: [true, "Driver is required"],
    },
    status: {
      type: String,
      enum: TRIP_STATUSES,
      default: "Draft",
    },
    eta: {
      type: String,
      default: "Awaiting dispatch",
    },
    cargo: {
      type: Number,
      required: [true, "Cargo weight is required"],
      min: [0, "Cargo weight cannot be negative"],
    },
    distance: {
      type: Number,
      required: [true, "Planned distance is required"],
      min: [0, "Distance cannot be negative"],
    },
    fuelConsumed: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalOdometer: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
module.exports.TRIP_STATUSES = TRIP_STATUSES;
