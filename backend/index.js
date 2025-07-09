const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Employee = require("./models/Employee");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB Connection Error:", err));

// Routes

// GET: Fetch all employees with optional filters
app.get("/api/employees", async (req, res) => {
  try {
    const query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.department) {
      query.department = req.query.department;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create new employee
app.post("/api/employees", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update an employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove an employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
