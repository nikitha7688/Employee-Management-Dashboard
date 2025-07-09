const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: {
      type: String,
      enum: ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations"],
      required: true,
    },
    role: { type: String, required: true },
    salary: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
