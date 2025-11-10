# Movie Ticket Booking Application

This is a full-stack movie ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js) for the backend and React with TypeScript for the frontend.

## Features

### User Features
- **Authentication:** Secure user registration and login with JWT.
- **Movie Browsing:** View a list of currently running and upcoming movies.
- **Movie Details:** See detailed information for each movie, including cast, crew, trailer, and synopsis.
- **Showtime Selection:** Choose from available showtimes and theaters.
- **Interactive Seat Map:** Select seats from a visual layout of the theater.
- **Booking:** Book tickets securely.
- **Payment:** Integrated with Stripe for payments.
- **Booking History:** View past and upcoming bookings.

### Admin Features (Role-based)
- **Theater Management (Super Admin):** Add, view, and manage theaters.
- **Screen Management (Theater Admin):** Add and manage screens within a theater, including seat configuration.
- **Movie Management (Theater Admin):** Add new movies and manage existing ones.
- **Show Management (Theater Admin):** Schedule shows for movies in specific screens.
- **User Management (Super Admin):** Manage user roles and permissions.
- **Analytics (Super Admin):** View sales reports and platform analytics.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Payment:** Stripe

### Frontend
- **Framework:** React (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & shadcn/ui
- **State Management:** Redux Toolkit & Zustand
- **Routing:** React Router

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- MongoDB instance (local or cloud)

### 1. Backend Setup

1.  Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
4.  Update the `.env` file with your configuration (MongoDB URI, JWT secrets, Stripe keys, etc.).
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:3000` (or your configured port).

### 2. Frontend Setup

1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
4.  Update the `.env` file with your backend API URL and Stripe publishable key.
    ```
    VITE_API_BASE_URL=http://localhost:3000/api/v1
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_pk_here
    ```
5.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).
