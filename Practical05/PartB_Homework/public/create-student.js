// Get references to the form and message elements:
const createStudentForm = document.getElementById("createStudentForm");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

createStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission

  messageDiv.textContent = ""; // Clear previous messages

  // Collect data from the form inputs
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");

  const newStudentData = {
    name: nameInput.value,
    address: addressInput.value,
  };

  try {
    // Make a POST request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the API we are sending JSON
      },
      body: JSON.stringify(newStudentData), // Send the data as a JSON string in the request body
    });

    // Check for API response status (e.g., 201 Created, 400 Bad Request, 500 Internal Server Error)
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 201) {
      messageDiv.textContent = `Student created successfully! ID: ${responseBody.id}`;
      messageDiv.style.color = "green";
      createStudentForm.reset(); // Clear the form after success
      console.log("Created Student:", responseBody);
    } else if (response.status === 400) {
      // Handle validation errors from the API (from Practical 04 validation middleware)
      messageDiv.textContent = `Validation Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Validation Error:", responseBody);
    } else {
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`,
      );
    }
  } catch (error) {
    console.error("Error creating Student:", error);
    messageDiv.textContent = `Failed to create student: ${error.message}`;
    messageDiv.style.color = "red";
  }
  const express = require("express");
  const path = require("path");
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
  app.use(express.static(path.join(__dirname, "public")));

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
});
