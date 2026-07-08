const sql = require("mssql");
const dbConfig = require("../dbConfig");
//Users attributes
/*user_id (INT, PRIMARY KEY)
username (VARCHAR(255), UNIQUE)
passwordHash (VARCHAR(255))
role (VARCHAR(20), ('member', 'librarian'))*/

// Get user by username (helper function for registerUser)
async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(
      "SELECT * FROM Users WHERE username = @username",
    );
    return result.recordset[0]; // undefined if no match found
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Create new user
async function createUser(username, passwordHash, role) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("username", username);
    request.input("passwordHash", passwordHash);
    request.input("role", role);
    const result = await request.query(query);

    const newUserId = result.recordset[0].id;
    return await getUserById(newUserId); // ← FIXED: was getBookById
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get all users
async function getAllUsers() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, username, email FROM Users"; // ← FIXED: was FROM Books
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get user by ID
async function getUserById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, username, email FROM Users WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return null;
    }
    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Update user by ID
async function updateUser(id, updatedUser) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Users SET username = @username, email = @email
      WHERE id = @id
    `;
    const request = connection.request();
    request.input("id", id);
    request.input("username", updatedUser.username);
    request.input("email", updatedUser.email);
    await request.query(query);
    return await getUserById(id);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Delete user by ID
async function deleteUser(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Users WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Search users by username or email  ← ADDED (Task 6)
async function searchUsers(searchTerm) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      SELECT * FROM Users
      WHERE username LIKE '%' + @searchTerm + '%'
         OR email LIKE '%' + @searchTerm + '%'
    `;
    const request = connection.request();
    request.input("searchTerm", sql.NVarChar, searchTerm);
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error in searchUsers:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection after searchUsers:", err);
      }
    }
  }
}

// Get users with their books  ← ADDED (Task 7)
async function getUsersWithBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
      FROM Users u
      LEFT JOIN UserBooks ub ON ub.user_id = u.id
      LEFT JOIN Books b ON ub.book_id = b.id
      ORDER BY u.username
    `;
    const result = await connection.request().query(query);

    const usersWithBooks = {};
    for (const row of result.recordset) {
      const userId = row.user_id;
      if (!usersWithBooks[userId]) {
        usersWithBooks[userId] = {
          id: userId,
          username: row.username,
          email: row.email,
          books: [],
        };
      }
      if (row.book_id !== null) {
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }
    }
    return Object.values(usersWithBooks);
  } catch (error) {
    console.error("Database error in getUsersWithBooks:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection after getUsersWithBooks:", err);
      }
    }
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers, // ← ADDED
  getUsersWithBooks, // ← ADDED
};
