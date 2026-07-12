const mongoose = require("mongoose");

const EXPENSE_STATUSES = ["Pending", "Completed"];

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
    },
    toll: {
      type: Number,
      default: 0,
      min: 0,
    },
    other: {
      type: Number,
      default: 0,
      min: 0,
    },
    maintenance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: EXPENSE_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
module.exports.EXPENSE_STATUSES = EXPENSE_STATUSES;
