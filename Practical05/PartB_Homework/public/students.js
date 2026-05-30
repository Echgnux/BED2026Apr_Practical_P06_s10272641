// Get references to the HTML elements you'll interact with:
const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentBtn");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to fetch books from the API and display them
async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students`);

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
    const students = await response.json();

    // Clear previous content and display books
    studentsListDiv.innerHTML = ""; // Clear loading message
    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
    } else {
      students.forEach((student) => {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student-item");
        // Use data attributes or similar to store ID on the element if needed later
        studentElement.setAttribute("data-student-id", student.student_id);
        studentElement.innerHTML = `
                    <h3>${student.name}</h3>
                    <p>Address: ${student.address}</p>
                    <p>ID: ${student.student_id}</p>
                    <button onclick="viewStudentDetails(${student.student_id})">View Details</button>
                    <button onclick="editStudent(${student.student_id})">Edit</button>
                    <button class="delete-btn" data-id="${student.student_id}">Delete</button>
                `;
        studentsListDiv.appendChild(studentElement);
      });
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
  }
}

// Placeholder functions for other actions (to be implemented later or in other files)
function viewStudentDetails(studentId) {
  console.log("View details for student ID:", studentId);
  // In a real app, redirect to view.html or show a modal
  window.location.href = `view.html?id=${studentId}`; // Assuming you create view.html
}

function editStudent(studentId) {
  console.log("Edit student with ID:", studentId);
  // In a real app, redirect to edit.html with the book ID
  window.location.href = `edit-student.html?id=${studentId}`; // Assuming you create edit.html
}

// Placeholder/Partial implementation for Delete (will be completed by learners)
async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");
  console.log("Attempting to delete book with ID:", studentId);
  // --- Start of code for learners to complete ---
  // TODO: Implement the fetch DELETE request here
  try {
    // Make a DELETE request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
      method: "DELETE", // Specify the HTTP method
    });

    if (response.status === 204) {
      messageDiv.textContent = `Student Deleted successfully!`;
      messageDiv.style.color = "green";
      const studentDiv = document.querySelector(
        `[data-student-id="${studentId}"]`,
      );
      studentDiv.remove();
    } else if (response.status === 404) {
      // Handling of 404 book not found error
      const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      messageDiv.textContent = `Student Not Found: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Student Not Found Error:", responseBody);
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
      const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`,
      );
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`,
      );
    }
  } catch (error) {
    console.error("Error Deleting Student:", error);
    messageDiv.textContent = `Failed to delete student: ${error.message}`;
    messageDiv.style.color = "red";
  }
  // TODO: Handle success (204) and error responses (404, 500)
  // TODO: On successful deletion, remove the student element from the DOM
  // --- End of code for learners to complete ---
}

// Fetch books when the button is clicked
fetchStudentsBtn.addEventListener("click", fetchStudents);

// Optionally, fetch books when the page loads
// window.addEventListener('load', fetchBooks); // Or call fetchBooks() directly
