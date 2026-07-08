const path = require("path");
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const {
  validateRegister,
  validateUserId,
} = require("./middlewares/userValidation");
// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// --- Add other general middleware here (e.g., logging, security headers) ---
app.use(express.static(path.join(__dirname, "public")));

//Routes for authentication
app.post("/register", validateRegister, authController.registerUser); // Register user
//app.post("/login", authController.login); // Login user

// Routes for users
app.post("/users", userController.createUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
app.get("/users/search", userController.searchUsers);
app.get("/users/with-books", userController.getUsersWithBooks);
app.get("/users/:id", userController.getUserById); // Get user by ID
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user

// Routes for books
// Apply middleware *before* the controller function for routes that need it
app.get("/books", bookController.getAllBooks);
app.get("/books/:book_id", validateBookId, bookController.getBookById); // Use validateBookId middleware
app.post("/books", validateBook, bookController.createBook); // Use validateBook middleware
// Add routes for PUT/DELETE if implemented, applying appropriate middleware
app.put(
  "/books/:book_id",
  validateBookId,
  validateBook,
  bookController.updateBook,
);
app.delete("/books/:book_id", validateBookId, bookController.deleteBook);

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
