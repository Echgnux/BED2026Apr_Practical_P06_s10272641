const userModel = require("../models/userModel");

// Create new user
async function createUser(req, res) {
  try {
    const newUser = await bookModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  zxsss;
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
}

// Update user by ID
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = await userModel.updateUser(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating user" });
  }
}

// Delete user by ID
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const deletedUser = await userModel.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Useer not found" });
    }

    res
      .status(200)
      .json({ message: `User with ID ${id} has been successfully deleted` });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
