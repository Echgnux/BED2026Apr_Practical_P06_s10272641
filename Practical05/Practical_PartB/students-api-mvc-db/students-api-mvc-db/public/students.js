// students.js — handles the All Students page

const API_BASE = "/students";

// Show a feedback message
function showMessage(text, type) {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = `message ${type} show`;
  // Auto-hide success messages after 3 seconds
  if (type === "success") {
    setTimeout(() => el.classList.remove("show"), 3000);
  }
}

// Build the HTML for one student row
function buildStudentItem(student) {
  const item = document.createElement("div");
  item.className = "student-item";
  item.id = `student-${student.student_id}`;

  item.innerHTML = `
    <div class="student-info">
      <span class="student-id">ID: ${student.student_id}</span>
      <div class="student-name">${student.name}</div>
      <div class="student-address">${student.address}</div>
    </div>
    <div class="student-actions">
      <a href="edit-student.html?id=${student.student_id}" class="btn btn-outline btn-sm">Edit</a>
      <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.student_id})">Delete</button>
    </div>
  `;

  return item;
}

// Fetch and render all students
async function loadStudents() {
  const listEl = document.getElementById("student-list");

  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const students = await response.json();
    listEl.innerHTML = "";

    if (students.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p>No students found.</p>
          <a href="create-student.html" class="btn btn-primary">Add the first student</a>
        </div>
      `;
      return;
    }

    students.forEach((student) => {
      listEl.appendChild(buildStudentItem(student));
    });
  } catch (error) {
    console.error("Error loading students:", error);
    listEl.innerHTML = `<div class="empty-state"><p>Failed to load students. Is the server running?</p></div>`;
  }
}

// Delete a student by ID
async function deleteStudent(id) {
  if (!confirm(`Are you sure you want to delete student ID ${id}?`)) return;

  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

    if (response.status === 404) {
      showMessage("Student not found.", "error");
      return;
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Remove the item from the DOM without reloading the full list
    const item = document.getElementById(`student-${id}`);
    if (item) item.remove();

    showMessage("Student deleted successfully.", "success");

    // If list is now empty, show the empty state
    const listEl = document.getElementById("student-list");
    if (listEl.children.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p>No students found.</p>
          <a href="create-student.html" class="btn btn-primary">Add the first student</a>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    showMessage("Failed to delete student. Please try again.", "error");
  }
}

// Run on page load
loadStudents();
