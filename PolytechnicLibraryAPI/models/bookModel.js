const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT book_id, title, author, availability FROM Books";
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

// Get book by ID
async function getBookById(book_id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "SELECT book_id, title, author, availability FROM Books WHERE book_id = @book_id";
    const request = connection.request();
    request.input("book_id", book_id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
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

// Create new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Books (title, author, availability) VALUES (@title, @author, @availability); SELECT SCOPE_IDENTITY() AS book_id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    request.input("availability", bookData.availability);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
    return await getBookById(newBookId);
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

// Update book by ID
async function updateBook(book_id, bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE Books SET title = @title, author = @author, availability = @availability
      WHERE book_id = @book_id
    `;
    const request = connection.request();
    request.input("book_id", book_id);
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    request.input("availability", bookData.availability);
    await request.query(query);

    return await getBookById(book_id); // Return the updated book
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

// Delete book by ID
async function deleteBook(book_id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Books WHERE book_id = @book_id";
    const request = connection.request();
    request.input("book_id", book_id);
    const result = await request.query(query);

    return result.rowsAffected[0] > 0; // Returns true if a row was deleted
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

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
