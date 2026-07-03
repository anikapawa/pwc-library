# PWC Library Application

A full-stack online library application built for the Penn Women's Center (PWC). This project serves as a comprehensive system for managing a physical book collection, coordinating a community book club, and facilitating organizational requests through a secure, database-driven administrative interface.

## Overview

The PWC Library application is a lightweight, full-stack platform that transforms library operations from manual, static processes into a dynamic, interactive system. It provides students with a seamless way to browse the collection, request checkouts, and engage with Book Club activities, while providing administrators with a robust dashboard to manage inventory, request queues, and event scheduling. 

The application is built using a modern Next.js stack, leveraging server-side rendering for performance, Supabase for real-time database management, and authenticated administrative workflows.

## Features

### Library Operations
* **Search & Discovery**: Robust search functionality by title, author, and genre with real-time filtering.
* **Request Lifecycle**: A state-driven system for Checkout and Hold requests, featuring an automated queue that prevents double-booking and manages request priority.
* **Inventory Management**: A full CRUD (Create, Read, Update, Delete) administrative interface for managing the book collection, including cover image hosting and metadata maintenance.

### Book Club & Community
* **Interactive Book Club**: A dynamic page displaying the current monthly selection, complete with meeting logistics (date, time, location).
* **RSVP & Recommendations**: Integrated RSVP functionality for meeting attendance tracking and a dedicated pipeline for student book recommendations.
* **Automatic Selection Cycle**: Admin-controlled logic that automatically transitions past book club picks to an archive grid while promoting new selections.

### Admin & Security
* **Authentication**: Secure administrative access via Supabase Auth, protected by middleware to ensure only authorized personnel can access the dashboard.
* **Admin Dashboard**: A centralized control center for processing requests, managing statuses (Pending, Approved, Rejected, Returned), and archiving completed transactions.
* **Email Integration**: Automated transactional email system (via Resend) that connects user actions directly to administrative workflows.

## Architecture

The application is structured into a modular, scalable full-stack architecture:

### 1. Data & Persistence Layer
* **Supabase**: Serves as the single source of truth for all application data, including book inventory, user requests, recommendations, and RSVP lists.
* **Row-Level Security (RLS)**: Implemented to secure data access and maintain integrity.

### 2. Backend & API
* **Next.js API Routes**: Acts as the communication bridge between the frontend and the database, handling POST/PUT/DELETE operations.
* **Middleware**: Handles route protection and authentication checks, ensuring non-admin users cannot access sensitive endpoints.

### 3. Frontend & UI
* **Component-Based Design**: Modular UI components (e.g., `BookCard`, `Navbar`, `StatusBadge`) ensure design consistency and reusability.
* **State-Driven Interactivity**: Employs React `useState` and `useEffect` to manage real-time UI updates based on database states.
* **Responsive Layouts**: Built with Tailwind CSS, featuring custom horizontal-scrolling carousels and adaptive grid layouts.

## Key Concepts

* **Queue Logic**: Implemented strict ordering logic to ensure requests are processed chronologically while accounting for current book availability.
* **State-Driven UI**: Admin actions (approve/reject/archive) are governed by the current system state, preventing invalid operations.
* **Soft Deletion**: Uses archiving flags rather than hard deletes to maintain data history and organization.
* **Controlled Inputs**: Uses React-controlled forms to ensure data structure consistency and validation before database insertion.

## Technologies Used

* **Next.js**: Framework for frontend and serverless API routing.
* **TypeScript**: Provides type safety across the entire application stack.
* **Tailwind CSS**: For consistent, responsive design systems.
* **Supabase**: Database, authentication, and backend-as-a-service.
* **Resend**: For automated administrative email notifications.

## Running the Project

1. **Clone the repository**:
   `git clone [repository-url]`
2. **Install dependencies**:
   `npm install`
3. **Configure Environment Variables**:
   Create a `.env.local` file with your Supabase and Resend API keys.
4. **Run the development server**:
   `npm run dev`

## Deployment Link
* https://pwc-library.vercel.app/

## Author

Anika Pawa | [GitHub: https://github.com/anikapawa](https://github.com/anikapawa)