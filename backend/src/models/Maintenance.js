const mongoose = require("mongoose");

const MAINTENANCE_STATUSES = ["In Shop", "Completed"];

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
    },
    service: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, "Service cost is required"],
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: MAINTENANCE_STATUSES,
      default: "In Shop",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
module.exports.MAINTENANCE_STATUSES = MAINTENANCE_STATUSES;
