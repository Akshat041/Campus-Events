// import { events } from "./events.js";

// student.js - Student interface functionality

// At the beginning of your JS files (both faculty.js and student.js)
// Initialize events from localStorage or use default if none exists
let events = JSON.parse(localStorage.getItem("events")) || [
  {
    id: 1,
    title: "Midterm Exam Review",
    date: "2025-04-01",
    startTime: "14:00",
    endTime: "16:00",
    category: "academic",
    location: "Science Building, Room 305",
    description: "Review session for Biology 101 midterm exam",
    createdBy: "prof_smith",
    lastModified: "2025-03-20T10:30:00",
  },
  {
    id: 2,
    title: "Spring Concert",
    date: "2025-04-15",
    startTime: "19:00",
    endTime: "22:00",
    category: "social",
    location: "Campus Auditorium",
    description: "Annual spring concert featuring student bands",
    createdBy: "prof_johnson",
    lastModified: "2025-03-15T09:15:00",
  },
  // More events would be added here
];

document.addEventListener("DOMContentLoaded", function () {
  // Security: Check if the current user is a student
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    // Redirect to login page if not logged in
    window.location.href = "index.html";
    return;
  }

  // DOM elements
  const calendarViewBtn = document.getElementById("calendarView");
  const listViewBtn = document.getElementById("listView");
  const calendarViewSection = document.getElementById("calendarViewSection");
  const listViewSection = document.getElementById("listViewSection");
  const logoutBtn = document.getElementById("logout");
  const filterCategory = document.getElementById("studentFilterCategory");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const currentMonthYearElem = document.getElementById("currentMonthYear");
  const modal = document.getElementById("eventModal");
  const closeButton = document.querySelector(".close-button");

  // Handle logout (used in faculty.js and student.js)
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }

  // Current date for calendar navigation
  let currentDate = new Date();

  // Initialize the calendar with current month
  renderCalendar(currentDate);

  // Event listeners
  calendarViewBtn.addEventListener("click", function () {
    calendarViewSection.classList.remove("hidden");
    listViewSection.classList.add("hidden");
    calendarViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
  });

  listViewBtn.addEventListener("click", function () {
    calendarViewSection.classList.add("hidden");
    listViewSection.classList.remove("hidden");
    calendarViewBtn.classList.remove("active");
    listViewBtn.classList.add("active");
    displayEventsList();
  });

  logoutBtn.addEventListener("click", logout);

  filterCategory.addEventListener("change", function () {
    if (calendarViewSection.classList.contains("hidden")) {
      displayEventsList();
    } else {
      renderCalendar(currentDate);
    }
  });

  prevMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Update header
    currentMonthYearElem.textContent = new Date(
      year,
      month,
      1
    ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Get the calendar grid element
    const calendarGrid = document.querySelector(".calendar-grid");

    // Clear previous days, keeping only the weekday headers
    const weekdayHeaders = calendarGrid.querySelectorAll(".weekday-header");
    calendarGrid.innerHTML = "";
    weekdayHeaders.forEach((header) => calendarGrid.appendChild(header));

    // Create empty cells for days before the first day of month
    for (let i = 0; i < firstDayWeekday; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day empty";
      calendarGrid.appendChild(emptyCell);
    }

    // Get filtered events for this month
    const filterValue = filterCategory.value;
    let monthEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    if (filterValue !== "all") {
      monthEvents = monthEvents.filter(
        (event) => event.category === filterValue
      );
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-day";

      // Create day number
      const dayNumber = document.createElement("div");
      dayNumber.className = "day-number";
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      // Find events for this day
      const dayStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const dayEvents = monthEvents.filter((event) => event.date === dayStr);

      // Add events to the day cell
      dayEvents.forEach((event) => {
        const eventDiv = document.createElement("div");
        eventDiv.className = `event-item ${event.category}`;
        eventDiv.textContent = event.title;
        eventDiv.dataset.eventId = event.id;
        eventDiv.addEventListener("click", function () {
          showEventDetails(event.id);
        });
        dayCell.appendChild(eventDiv);
      });

      calendarGrid.appendChild(dayCell);
    }
  }

  function displayEventsList() {
    const eventsListContainer = document.getElementById("eventsList");
    eventsListContainer.innerHTML = "";

    // Get filter value
    const filterValue = filterCategory.value;

    // Filter and sort events
    let filteredEvents = events;
    if (filterValue !== "all") {
      filteredEvents = events.filter((event) => event.category === filterValue);
    }

    // Only show future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });

    // Sort by date
    filteredEvents.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA - dateB;
    });

    // Group events by month
    const eventsByMonth = {};

    filteredEvents.forEach((event) => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }

      eventsByMonth[monthYear].push(event);
    });

    // Create list for each month
    for (const monthYear in eventsByMonth) {
      const monthHeader = document.createElement("h3");
      monthHeader.className = "month-header";
      monthHeader.textContent = monthYear;
      eventsListContainer.appendChild(monthHeader);

      const eventsList = document.createElement("ul");
      eventsList.className = "events-list";

      eventsByMonth[monthYear].forEach((event) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        const listItem = document.createElement("li");
        listItem.className = `event-list-item ${event.category}`;
        listItem.innerHTML = `
              <div class="event-date">${formattedDate}</div>
              <div class="event-details">
                <h4>${event.title}</h4>
                <p>${formatTime(event.startTime)} - ${formatTime(
          event.endTime
        )} | ${event.location}</p>
              </div>
            `;

        listItem.addEventListener("click", function () {
          showEventDetails(event.id);
        });

        eventsList.appendChild(listItem);
      });

      eventsListContainer.appendChild(eventsList);
    }

    // Display message if no events
    if (Object.keys(eventsByMonth).length === 0) {
      const noEvents = document.createElement("p");
      noEvents.className = "no-events";
      noEvents.textContent = "No upcoming events to display.";
      eventsListContainer.appendChild(noEvents);
    }
  }

  function showEventDetails(id) {
    const event = events.find((e) => e.id === id);
    if (!event) return;

    // Populate modal with event details
    document.getElementById("modalTitle").textContent = event.title;

    const eventDate = new Date(event.date);
    document.getElementById("modalDate").textContent =
      eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    document.getElementById("modalTime").textContent = `${formatTime(
      event.startTime
    )} - ${formatTime(event.endTime)}`;
    document.getElementById("modalLocation").textContent = event.location;
    document.getElementById("modalCategory").textContent =
      capitalizeFirstLetter(event.category);
    document.getElementById("modalDescription").textContent =
      event.description || "No description provided.";

    // Display modal
    modal.style.display = "block";
  }

  // Helper functions
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
