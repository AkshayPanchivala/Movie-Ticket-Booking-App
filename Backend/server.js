require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import controllers for nested routes
const { getScreensByTheater } = require('./controllers/screenController');
const { getSeatsByScreen, createSeatsBulk, generateSeatsForScreen } = require('./controllers/seatController');
const { getShowsByMovie } = require('./controllers/showController');
const { protect, authorize } = require('./middleware/auth');
const { publicLimiter, adminLimiter } = require('./middleware/rateLimiter');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  // origin: process.env.CORS_ORIGIN || '*',
  origin:  '*',
  credentials: true
}));

// Stripe webhook - must be before body parser
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), require('./controllers/paymentController').handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CineHub API Documentation',
  customfavIcon: '/favicon.ico'
}));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CineHub API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// API Routes
const API_VERSION = '/api/v1';

// Auth routes
app.use(`${API_VERSION}/auth`, require('./routes/auth'));

// Movie routes
app.use(`${API_VERSION}/movies`, require('./routes/movies'));

// Theater routes
app.use(`${API_VERSION}/theaters`, require('./routes/theaters'));

// Screen routes
app.use(`${API_VERSION}/screens`, require('./routes/screens'));

// Show routes
app.use(`${API_VERSION}/shows`, require('./routes/shows'));

// Booking routes
app.use(`${API_VERSION}/bookings`, require('./routes/bookings'));

// User routes
app.use(`${API_VERSION}/users`, require('./routes/users'));

// Analytics routes
app.use(`${API_VERSION}/analytics`, require('./routes/analytics'));

// Payment routes
app.use(`${API_VERSION}/payments`, require('./routes/payments'));

// Config routes
app.use(`${API_VERSION}/config`, require('./routes/config'));

// Nested routes
// GET /api/v1/theaters/:theaterId/screens
app.get(`${API_VERSION}/theaters/:theaterId/screens`, publicLimiter, getScreensByTheater);

// GET /api/v1/screens/:screenId/seats
app.get(`${API_VERSION}/screens/:screenId/seats`, publicLimiter, getSeatsByScreen);

// POST /api/v1/screens/:screenId/seats/bulk
app.post(
  `${API_VERSION}/screens/:screenId/seats/bulk`,
  adminLimiter,
  protect,
  authorize('theater_admin', 'super_admin'),
  createSeatsBulk
);

// POST /api/v1/screens/:screenId/seats/generate
app.post(
  `${API_VERSION}/screens/:screenId/seats/generate`,
  adminLimiter,
  protect,
  authorize('theater_admin', 'super_admin'),
  generateSeatsForScreen
);

// GET /api/v1/movies/:movieId/shows
app.get(`${API_VERSION}/movies/:movieId/shows`, publicLimiter, getShowsByMovie);

// File upload route (placeholder - implement with multer as needed)
app.post(
  `${API_VERSION}/upload/poster`,
  protect,
  authorize('theater_admin', 'super_admin'),
  (req, res) => {
    res.status(501).json({
      success: false,
      message: 'File upload not implemented yet'
    });
  }
);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
