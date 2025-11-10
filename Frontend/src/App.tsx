import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { MoviesList } from '@/pages/user/MoviesList';
import { BookingPage } from '@/pages/user/BookingPage';
import { MyBookings } from '@/pages/user/MyBookings';
import { ManageMovies } from '@/pages/admin/ManageMovies';
import { ManageScreens } from '@/pages/admin/ManageScreens';
import { ManageShows } from '@/pages/admin/ManageShows';
import { SalesReport } from '@/pages/admin/SalesReport';
import { Analytics } from '@/pages/super-admin/Analytics';
import { ManageTheaters } from '@/pages/super-admin/ManageTheaters';
import { ManageUsers } from '@/pages/super-admin/ManageUsers';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MoviesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking/:movieId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute requiredRole="theater_admin">
                <ManageMovies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/screens"
            element={
              <ProtectedRoute requiredRole="theater_admin">
                <ManageScreens />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/shows"
            element={
              <ProtectedRoute requiredRole="theater_admin">
                <ManageShows />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute requiredRole="theater_admin">
                <SalesReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/analytics"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/theaters"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <ManageTheaters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/users"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/movies"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <ManageMovies />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
