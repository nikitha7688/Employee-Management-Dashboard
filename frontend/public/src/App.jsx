import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";

const departments = ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations"];

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredName, setFilteredName] = useState("");
  const [filteredDept, setFilteredDept] = useState("");
  const [statusFilter, setStatusFilter] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    salary: "",
    status: "Active",
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        params: {
          name: filteredName,
          department: filteredDept,
          status: statusFilter ? "Active" : "",
        },
      });
      setEmployees(res.data);
    } catch (err) {
      alert("Error fetching employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filteredName, filteredDept, statusFilter]);

  const openModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
    setFormData(data || {
      name: "",
      department: "",
      role: "",
      salary: "",
      status: "Active",
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
      alert("Employee deleted");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.role || !formData.salary) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editData) {
        await axios.put(`http://localhost:5000/api/employees/${editData._id}`, formData);
        alert("Employee updated");
      } else {
        await axios.post("http://localhost:5000/api/employees", formData);
        alert("Employee added");
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (err) {
      alert("Failed to save employee");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Employee Management Dashboard</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-9 border rounded px-3 py-2 w-52"
              onChange={(e) => setFilteredName(e.target.value)}
            />
          </div>
          <select
            className="border rounded px-3 py-2 w-52"
            onChange={(e) => setFilteredDept(e.target.value)}
            defaultValue=""
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={statusFilter}
              onChange={(e) => setStatusFilter(e.target.checked)}
            />
            Active Only
          </label>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-200 text-blue-800">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Salary</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="bg-white hover:bg-gray-100">
                  <td className="p-3 border">{emp.name}</td>
                  <td className="p-3 border">{emp.department}</td>
                  <td className="p-3 border">{emp.role}</td>
                  <td className="p-3 border">{emp.salary}</td>
                  <td className="p-3 border">{emp.status}</td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(emp)}
                        className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td className="p-3 text-center border" colSpan="6">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">{editData ? "Edit" : "Add"} Employee</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                className="border px-3 py-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <select
                className="border px-3 py-2 rounded"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Role"
                className="border px-3 py-2 rounded"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              <input
                type="number"
                placeholder="Salary"
                className="border px-3 py-2 rounded"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
              <select
                className="border px-3 py-2 rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editData ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
