# College Event Calendar

## Overview

This web application is a college event calendar designed to help students and faculty stay informed about campus events. It provides two distinct user interfaces:

- **Faculty Interface:** Allows faculty members to add, edit, and delete events.
- **Student Interface:** Allows students to view events, filter them by category, and see event details.

## Features

- **Event Display:**
  - Clear calendar view of upcoming events.
  - Event details display (title, date, time, location, description).
  - Event filtering by category.
- **Faculty Event Management:**
  - Form for adding new events.
  - Ability to edit and delete existing events.
  - (Note: Front-end access control is implemented. See "Security Considerations".)

## Technologies Used

- HTML
- CSS
- JavaScript
- Local Storage (for data persistence)

## Setup/Installation (for development)

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:Akshat041/Campus-Events.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Campus-Events
    ```
3.  **Open `index.html` in your browser:** The application should run directly without any server setup.

## Data Storage

The application uses `localStorage` to store event data. This means that events are stored in the user's browser and will persist between page reloads.

## Security Considerations

- **Front-End Only:** This application uses only front-end technologies. As such, the "security" of the faculty section (preventing students from adding/editing events) is implemented in JavaScript.
- **Limitations:** **This is NOT a secure solution.** A knowledgeable user could bypass the front-end checks.
- **Real-World Applications:** In a real-world application, proper user authentication and server-side authorization would be required to secure the faculty section.

## Future Enhancements

- Implement user authentication and authorization.
- Connect to a database to store event data.
- Add recurring event functionality.
- Improve the user interface and user experience.
- Add a search functionality.

## Important Notes

    * This project was created as a demonstration using HTML, CSS, and JavaScript.

## Author

\Akshat Singh
