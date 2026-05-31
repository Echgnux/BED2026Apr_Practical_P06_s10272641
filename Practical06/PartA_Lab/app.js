const path = require("path");
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const userController = require("./controllers/userController"); // Note: Changed to userController for consistency

/*// ... existing code after
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware*/

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

app.post("/users", userController.createUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/search", userController.searchUsers);
app.get("/users/with-books", userController.getUsersWithBooks);
app.get("/users/:id", userController.getUserById); // Get user by ID
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// --- Add other general middleware here (e.g., logging, security headers) ---
app.use(express.static(path.join(__dirname, "public")));

// Routes for users
app.post("/users", userController.createUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/:id", userController.getUserById); // Get user by ID
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user

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
