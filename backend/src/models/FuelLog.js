const mongoose = require("mongoose");

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    liters: {
      type: Number,
      required: [true, "Liters is required"],
      min: [0, "Liters cannot be negative"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [0, "Cost cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelLog", fuelLogSchema);
