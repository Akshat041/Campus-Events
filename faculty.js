// At the beginning of your JS files (both faculty.js and student.js)
// Initializing events from localStorage or use default if none exists
let events = JSON.parse(localStorage.getItem("events")) || [
  {
    id: 1,
    title: "Engenious Technical Event",
    date: "2025-03-25",
    startTime: "09:00",
    endTime: "12:00",
    category: "technical",
    location: "KIT Building, Room 303",
    description:
      "Teams compete in a high-stakes challenge, demonstrating their problem-solving and technical skills. Expect intense competition and groundbreaking solutions.",
    createdBy: "Faculty_member_1",
    lastModified: "2025-03-20T10:30:00",
  },
  {
    id: 2,
    title: "Rangoli Making",
    date: "2025-03-26",
    startTime: "09:15",
    endTime: "11:00",
    category: "cultural",
    location: "Room No H-325",
    description:
      "Annual rangoli competition to showcase creativity and artistry.",
    createdBy: "faculty_member_2",
    lastModified: "2025-03-15T09:15:00",
  },
  // More events would be added here
];

document.addEventListener("DOMContentLoaded", function () {
  // Security: Check if the current user is faculty
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "faculty") {
    // Redirect to login page if not faculty
    window.location.href = "index.html";
    return;
  }

  // DOM elements
  const eventForm = document.getElementById("eventForm");
  const eventFormSection = document.getElementById("eventFormSection");
  const eventListSection = document.getElementById("eventListSection");
  const addEventBtn = document.getElementById("addEvent");
  const viewEventsBtn = document.getElementById("viewEvents");
  const logoutBtn = document.getElementById("logout");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const filterCategory = document.getElementById("filterCategory");

  // Initially show the event list
  eventFormSection.classList.add("hidden");
  eventListSection.classList.remove("hidden");

  // Load and display all events
  displayEvents();

  // Event listeners
  addEventBtn.addEventListener("click", showAddEventForm);
  viewEventsBtn.addEventListener("click", showEventList);
  logoutBtn.addEventListener("click", logout);
  cancelEditBtn.addEventListener("click", cancelEdit);
  filterCategory.addEventListener("change", displayEvents);

  // Handle logout (used in faculty.js and student.js)
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }

  // Event form submission
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveEvent();
  });

  function showAddEventForm() {
    // Reset form for new event
    eventForm.reset();
    document.getElementById("eventId").value = "";
    document.querySelector('button[type="submit"]').textContent = "Save Event";

    // Show form, hide list
    eventFormSection.classList.remove("hidden");
    eventListSection.classList.add("hidden");
  }

  function showEventList() {
    eventFormSection.classList.add("hidden");
    eventListSection.classList.remove("hidden");
    displayEvents();
  }

  function cancelEdit() {
    eventForm.reset();
    showEventList();
  }

  function saveEvent() {
    // Get form values
    const eventId = document.getElementById("eventId").value;
    const newEvent = {
      title: document.getElementById("eventTitle").value.trim(),
      date: document.getElementById("eventDate").value,
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      category: document.getElementById("category").value,
      location: document.getElementById("location").value.trim(),
      description: document.getElementById("description").value.trim(),
      createdBy: currentUser.username,
      lastModified: new Date().toISOString(),
    };

    // Add or update event
    if (eventId) {
      // Update existing event
      newEvent.id = parseInt(eventId);
      const index = events.findIndex((e) => e.id === newEvent.id);
      if (index !== -1) {
        events[index] = newEvent;
      }
    } else {
      // Add new event
      newEvent.id = getNextEventId();
      events.push(newEvent);
    }

    // Save to localStorage (simulating database)
    localStorage.setItem("events", JSON.stringify(events));

    // Reset form and show event list
    eventForm.reset();
    showEventList();
  }

  function displayEvents() {
    // Get filter value
    const filterValue = filterCategory.value;

    // Filter events based on category
    let filteredEvents = events;
    if (filterValue !== "all") {
      filteredEvents = events.filter((event) => event.category === filterValue);
    }

    // Sort events by date and time
    filteredEvents.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA - dateB;
    });

    // Get table body element
    const tableBody = document.getElementById("eventsTableBody");
    tableBody.innerHTML = "";

    // Populate table with events
    filteredEvents.forEach((event) => {
      const row = document.createElement("tr");

      // Format date and time
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const startTime = formatTime(event.startTime);
      const endTime = formatTime(event.endTime);

      row.innerHTML = `
            <td>${event.title}</td>
            <td>${formattedDate}</td>
            <td>${startTime} - ${endTime}</td>
            <td>${event.location}</td>
            <td>${capitalizeFirstLetter(event.category)}</td>
            <td>
              <button class="edit-btn" data-id="${event.id}">Edit</button>
              <button class="delete-btn" data-id="${event.id}">Delete</button>
            </td>
          `;

      tableBody.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        editEvent(parseInt(this.dataset.id));
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        deleteEvent(parseInt(this.dataset.id));
      });
    });
  }

  function editEvent(id) {
    // Find event by id
    const event = events.find((e) => e.id === id);
    if (!event) return;

    // Populate form with event data
    document.getElementById("eventId").value = event.id;
    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("startTime").value = event.startTime;
    document.getElementById("endTime").value = event.endTime;
    document.getElementById("category").value = event.category;
    document.getElementById("location").value = event.location;
    document.getElementById("description").value = event.description;

    // Update submit button text
    document.querySelector('button[type="submit"]').textContent =
      "Update Event";

    // Show form, hide list
    eventFormSection.classList.remove("hidden");
    eventListSection.classList.add("hidden");
  }

  function deleteEvent(id) {
    if (confirm("Are you sure you want to delete this event?")) {
      // Remove event from array
      events = events.filter((e) => e.id !== id);

      // Save to localStorage
      localStorage.setItem("events", JSON.stringify(events));

      // Refresh display
      displayEvents();
    }
  }

  // Helper functions
  function getNextEventId() {
    return events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
