# **App Name**: MeetingSphere

## Core Features:

- Microsoft O365 Login: Enable user authentication via Microsoft Office 365 (Azure AD).
- User Role Management: Set user roles to 'admin' upon first login if the user's email address is sutad.k@icpfertilizer.com; default user profiles include uid, email, displayName, role ('user' by default), and status ('active' by default).
- Real-time Booking Calendar: Display a booking calendar as a timeline grid with rooms as rows and time slots as columns, updating in real time.
- Booking Modal: Implement a modal for booking available time slots with fields for topic and contact number; prevent double-booking.
- Monitor View: Display a full-page monitor view with real-time updates of room statuses, booker's name, topic, and time range.
- Admin Panel: Provide an admin-only section for user management (change roles and statuses), room management (add, edit, deactivate), and booking history management (search, filter, edit, delete).
- Access Control: Ensure the blocking status on a user blocks them from being able to log into the app. The tool will reference this user blocking state to determine whether to grant a login request.

## Style Guidelines:

- Background: Earth-tone palette with dark beige (#F5F5DC) as the primary background.
- Secondary color: Charcoal gray (#36454F) for secondary backgrounds.
- Accent: Combination of red (#FF4500), orange (#FF8C00), and yellow (#FFD700) for primary buttons, active states, and highlights.
- Body and headline font: 'Inter' (sans-serif) for a modern, objective feel.
- Use professional icons for meeting rooms, users, and booking actions.
- Elegant and professional layout with a clear separation of sections and a focus on usability.
- Subtle animations for transitions and real-time updates; neon-glow border with a red-orange-yellow gradient for the Monitor View room cards.