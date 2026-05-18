const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const studentController = require("./controllers/studentController");
const {
  validateStudent,
  validateStudentId,
} = require("./middlewares/studentValidation"); // Import Student Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes for students
// Apply middleware *before* the controller function for routes that need it
app.get("/students", studentController.getAllStudents);
app.get(
  "/students/:student_id",
  validateStudentId,
  studentController.getStudentById,
); // Use validateStudentId middleware
app.post("/students", validateStudent, studentController.createStudent); // Use validateStudent middleware
app.put(
  "/students/:student_id",
  validateStudentId,
  validateStudent,
  studentController.updateStudent,
); // Use both middleware
app.delete(
  "/students/:student_id",
  validateStudentId,
  studentController.deleteStudent,
); // Use validateStudentId middleware

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});
