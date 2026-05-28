const studentModel = require("../models/studentModel");

// Get all students
async function getAllStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving students" });
  }
}

// Get student by ID
async function getStudentById(req, res) {
  try {
    const id = parseInt(req.params.student_id);
    const student = await studentModel.getStudentById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving student" });
  }
}

// Create new student
async function createStudent(req, res) {
  try {
    const newStudent = await studentModel.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating student" });
  }
}

// Update student by ID
async function updateStudent(req, res) {
  try {
    const id = parseInt(req.params.student_id);
    const updatedStudent = await studentModel.updateStudent(id, req.body);

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating student" });
  }
}

// Delete student by ID
async function deleteStudent(req, res) {
  try {
    const id = parseInt(req.params.student_id);
    const deleted = await studentModel.deleteStudent(id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res
      .status(200)
      .json({ message: `Student with ID ${id} has been successfully deleted` });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
