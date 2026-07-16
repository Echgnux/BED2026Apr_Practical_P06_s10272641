// book.test.js
const Book = require("../models/bookModel");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
    expect(books[1].id).toBe(2);
    expect(books[1].title).toBe("The Hitchhiker's Guide to the Galaxy");
    expect(books[1].author).toBe("Douglas Adams");
    expect(books[1].availability).toBe("N");
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

describe("Book.updateBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the book and return the updated book", async () => {
    const bookId = 1;
    const bookData = {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      availability: "N",
    };
    const updatedBook = { id: bookId, ...bookData };

    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [updatedBook] }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const result = await Book.updateBook(bookId, bookData);

    expect(mockRequest.input).toHaveBeenCalledWith("book_id", bookId);
    expect(mockRequest.input).toHaveBeenCalledWith("title", bookData.title);
    expect(mockRequest.input).toHaveBeenCalledWith("author", bookData.author);
    expect(mockRequest.input).toHaveBeenCalledWith(
      "availability",
      bookData.availability,
    );
    expect(result).toEqual(updatedBook);
    expect(mockConnection.close).toHaveBeenCalled();
  });

  it("should return null if the book with the given id does not exist", async () => {
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }), // no matching row, from either query
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const result = await Book.updateBook(999, {
      title: "x",
      author: "y",
      availability: "Y",
    });

    expect(result).toBeFalsy(); // null (or undefined) depending on getBookById's implementation
  });

  it("should throw an error if the database connection fails", async () => {
    sql.connect.mockRejectedValue(new Error("Database Error"));

    await expect(
      Book.updateBook(1, { title: "x", author: "y", availability: "Y" }),
    ).rejects.toThrow("Database Error");
  });
});
