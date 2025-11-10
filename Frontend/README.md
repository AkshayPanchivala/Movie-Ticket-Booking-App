# Movie Ticket Booking - Frontend

This is the frontend for the Movie Ticket Booking application, built with React, TypeScript, Vite, and styled with Tailwind CSS and shadcn/ui.

## Features

### User Panel
- Browse all movies with a modern grid view.
- View detailed movie information (trailer, synopsis, cast, rating).
- Select theater, date, and showtime.
- Interactive seat selection with a visual seat map.
- Book tickets and process payments via Stripe.
- View personal booking history.
- Responsive design for mobile and desktop.

### Admin Panels (Role-Based)
- **Theater Admin:** Manage movies, screens, seating layouts, showtimes, and view sales reports.
- **Super Admin:** Manage theaters, assign theater admins, view platform-wide analytics, and manage users.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Redux Toolkit & Zustand
- **Routing**: React Router DOM
- **Form Management**: React Hook Form
- **Data Fetching**: Axios

## Prerequisites

- Node.js (v14 or higher)
- npm
- A running instance of the backend server.

## Setup

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

### Environment Variables

Your `.env` file must contain the following variables:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Stripe Payment Gateway
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Available Scripts

### `npm run dev`
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

### `npm run build`
Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`
Lints the project files using ESLint.

### `npm run preview`
Serves the production build locally to preview it.

## Project Structure

```
Frontend/
├── src/
│   ├── components/      # Reusable UI components (MovieCard, SeatGrid, etc.)
│   ├── contexts/        # React contexts (e.g., ConfigContext)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility functions, Axios instance
│   ├── pages/           # Top-level page components for each route
│   ├── services/        # API service layers for fetching data
│   ├── store/           # Redux Toolkit store, slices, and middleware
│   └── types/           # TypeScript type definitions
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
└── vite.config.ts       # Vite configuration
```