// create-student.js — handles the Create Student page

const API_BASE = "/students";

// Show a feedback message
function showMessage(text, type) {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = `message ${type} show`;
}

// Send POST request to create a new student
async function createStudent() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();

  // Basic client-side check before hitting the API
  if (!name || !address) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Show the validation error message from the API (e.g. from Joi)
      showMessage(data.error || "Failed to create student.", "error");
      return;
    }

    // Clear the form inputs on success
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";

    showMessage(
      `Student "${data.name}" created successfully! (ID: ${data.student_id})`,
      "success",
    );
  } catch (error) {
    console.error("Error creating student:", error);
    showMessage("An unexpected error occurred. Please try again.", "error");
  }
}
