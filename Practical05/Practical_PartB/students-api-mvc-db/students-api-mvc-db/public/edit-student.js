// edit-student.js — handles the Edit Student page

const API_BASE = "/students";

// Read the student ID from the URL query string: edit-student.html?id=3
const params = new URLSearchParams(window.location.search);
const studentId = parseInt(params.get("id"));

// Show a feedback message
function showMessage(text, type) {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = `message ${type} show`;
}

// Fetch the existing student data and populate the form
async function loadStudent() {
  if (!studentId || studentId <= 0) {
    showMessage("Invalid or missing student ID in the URL.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${studentId}`);

    if (response.status === 404) {
      showMessage("Student not found.", "error");
      return;
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const student = await response.json();

    // Populate form fields with existing data
    document.getElementById("name").value = student.name;
    document.getElementById("address").value = student.address;

    // Update the page title to show which student is being edited
    document.querySelector("h1").textContent =
      `Edit Student #${student.student_id}`;
  } catch (error) {
    console.error("Error loading student:", error);
    showMessage("Failed to load student data. Is the server running?", "error");
  }
}

// Send PUT request to update the student
async function updateStudent() {
  if (!studentId || studentId <= 0) {
    showMessage("Invalid student ID.", "error");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !address) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Show the validation or not-found error from the API
      showMessage(data.error || "Failed to update student.", "error");
      return;
    }

    showMessage("Student updated successfully!", "success");
  } catch (error) {
    console.error("Error updating student:", error);
    showMessage("An unexpected error occurred. Please try again.", "error");
  }
}

// Load student data as soon as the page is ready
loadStudent();
