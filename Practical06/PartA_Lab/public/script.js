// Get references to the HTML elements you'll interact with:
const booksListDiv = document.getElementById("booksList");
const fetchBooksBtn = document.getElementById("fetchBooksBtn");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to fetch books from the API and display them
async function fetchBooks() {
  try {
    booksListDiv.innerHTML = "Loading books..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books`);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      // Attempt to read error body if available, otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`,
      );
    }

    // Parse the JSON response
    const books = await response.json();

    // Clear previous content and display books
    booksListDiv.innerHTML = ""; // Clear loading message
    if (books.length === 0) {
      booksListDiv.innerHTML = "<p>No books found.</p>";
    } else {
      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        // Use data attributes or similar to store ID on the element if needed later
        bookElement.setAttribute("data-book-id", book.id);
        bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>ID: ${book.id}</p>
                    <button onclick="viewBookDetails(${book.id})">View Details</button>
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button class="delete-btn" data-id="${book.id}">Delete</button>
                `;
        booksListDiv.appendChild(bookElement);
      });
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
  }
}

// Placeholder functions for other actions (to be implemented later or in other files)
function viewBookDetails(bookId) {
  console.log("View details for book ID:", bookId);
  // In a real app, redirect to view.html or show a modal
  window.location.href = `view.html?id=${bookId}`; // Assuming you create view.html
}

function editBook(bookId) {
  console.log("Edit book with ID:", bookId);
  // In a real app, redirect to edit.html with the book ID
  window.location.href = `edit.html?id=${bookId}`; // Assuming you create edit.html
}

// Placeholder/Partial implementation for Delete (will be completed by learners)
async function handleDeleteClick(event) {
  const bookId = event.target.getAttribute("data-id");
  console.log("Attempting to delete book with ID:", bookId);
  // --- Start of code for learners to complete ---
  // TODO: Implement the fetch DELETE request here
  try {
    // Make a DELETE request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: "DELETE", // Specify the HTTP method
    });

    if (response.status === 204) {
      messageDiv.textContent = `Book Deleted successfully!`;
      messageDiv.style.color = "green";
      const bookDiv = document.querySelector(`[data-book-id="${bookId}"]`);
      bookDiv.remove();
    } else if (response.status === 404) {
      // Handling of 404 book not found error
      const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      messageDiv.textContent = `Book Not Found: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Book Not Found Error:", responseBody);
    } else if (response.status === 500) {
      const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      messageDiv.textContent = `Server error: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Internal server error:", responseBody);
    } else {
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`,
      );
    }
  } catch (error) {
    console.error("Error Deleting book:", error);
    messageDiv.textContent = `Failed to delete book: ${error.message}`;
    messageDiv.style.color = "red";
  }
  // TODO: Handle success (204) and error responses (404, 500)
  // TODO: On successful deletion, remove the book element from the DOM
  // --- End of code for learners to complete ---
}

// Fetch books when the button is clicked
fetchBooksBtn.addEventListener("click", fetchBooks);

// Optionally, fetch books when the page loads
// window.addEventListener('load', fetchBooks); // Or call fetchBooks() directly
