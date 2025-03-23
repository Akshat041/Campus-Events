import { users } from "./users.js";

document.addEventListener("DOMContentLoaded", function () {
  // Checking if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    // Redirecting to appropriate page based on role
    redirectToUserPage(currentUser.role);
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("loginError");

      // In a real application, this would make an API call to verify credentials
      // For demonstration, we're using the simulated users array from events.js

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Store user info in localStorage (in a real app, store a token instead)
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: user.username,
            role: user.role,
          })
        );

        // Redirect to appropriate page
        redirectToUserPage(user.role);
      } else {
        errorMessage.textContent = "Invalid username or password";
      }
    });
  }
});

// Function to redirect based on user role
function redirectToUserPage(role) {
  if (role === "faculty") {
    window.location.href = "faculty.html";
  } else if (role === "student") {
    window.location.href = "student.html";
  }
}
