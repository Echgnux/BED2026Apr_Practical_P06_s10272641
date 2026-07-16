// booksController.test.js

const booksController = require("../controllers/bookController");
const Book = require("../models/bookModel");

// Mock the Book model
jest.mock("../models/bookModel"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), // mock json, not send
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving books" });
  });
});
/*
async function updateBook(req, res) {
  try {
    const book_id = parseInt(req.params.book_id);
    const updatedBook = await bookModel.updateBook(book_id, req.body);

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book" });
  }
}
*/
describe("booksController.updateBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a book and return the updated book as JSON", async () => {
    const mockUpdatedBook = {
      id: 1,
      title: "The Lord of the Rings",
      available: false,
    };

    Book.updateBook.mockResolvedValue(mockUpdatedBook);

    const req = {
      params: { book_id: "1" },
      body: { available: false },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await booksController.updateBook(req, res);

    expect(Book.updateBook).toHaveBeenCalledWith(1, req.body); // note: parseInt'd to a number
    expect(res.json).toHaveBeenCalledWith(mockUpdatedBook);
    expect(res.status).not.toHaveBeenCalled(); // success path never touches status
  });

  it("should return 404 if the book is not found", async () => {
    Book.updateBook.mockResolvedValue(null); // model returns falsy when no match

    const req = {
      params: { book_id: "999" },
      body: { available: false },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
  });

  it("should handle errors and return a 500 status with error message", async () => {
    Book.updateBook.mockRejectedValue(new Error("Database error"));

    const req = {
      params: { book_id: "1" },
      body: { available: false },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await booksController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error updating book" });
  });
});
