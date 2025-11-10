# CineHub Backend API

A comprehensive cinema booking system backend built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT-based)
- Role-based access control (User, Theater Admin, Super Admin)
- Movie management
- Theater and screen management
- Show scheduling
- Seat booking with conflict prevention
- Stripe Payment Integration
- Analytics and reporting
- Rate limiting
- Error handling
- **Interactive Swagger API Documentation**

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe
- **API Documentation**: Swagger/OpenAPI 3.0

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm

## Setup

1.  Clone the repository and navigate to the `Backend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
4.  Update the `.env` file with your specific configuration.

### Environment Variables

Your `.env` file should contain the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173 # Or your frontend URL

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_PUBLIC=100
RATE_LIMIT_MAX_AUTH=1000
RATE_LIMIT_MAX_ADMIN=2000

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Booking Settings
PLATFORM_FEE=50
```

## Running the Application

### Development Mode
Starts the server with `nodemon` for automatic restarts on file changes.
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (defaults to 3000).

## API Documentation

Once the server is running, access the interactive Swagger API documentation at:

**🔗 http://localhost:3000/api-docs**

The Swagger UI provides a complete API reference, interactive testing, and request/response schemas.

## Scripts

- `npm run seed:admins`: Run this script to seed the database with initial admin users.

## API Endpoints Summary

Base URL: `http://localhost:3000/api/v1`

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

### Movies Endpoints

#### Get All Movies
```http
GET /api/v1/movies?page=1&limit=20&genre=Action&search=Avengers
```

#### Get Movie by ID
```http
GET /api/v1/movies/:id
```

#### Create Movie (Admin)
```http
POST /api/v1/movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Movie",
  "description": "Movie description",
  "poster_url": "https://example.com/poster.jpg",
  "trailer_url": "https://youtube.com/watch?v=...",
  "director": "Director Name",
  "genre": ["Action", "Adventure"],
  "language": "English",
  "duration": 120,
  "movie_cast": ["Actor 1", "Actor 2"],
  "rating": 8.0,
  "runtime": 120,
  "release_date": "2025-12-01"
}
```

#### Update Movie (Admin)
```http
PUT /api/v1/movies/:id
Authorization: Bearer <token>
```

#### Delete Movie (Super Admin)
```http
DELETE /api/v1/movies/:id
Authorization: Bearer <token>
```

### Theaters Endpoints

#### Get All Theaters
```http
GET /api/v1/theaters?city=New York&page=1&limit=20
```

#### Get Theater by ID
```http
GET /api/v1/theaters/:id
```

#### Create Theater (Super Admin)
```http
POST /api/v1/theaters
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CineMax Downtown",
  "location": "123 Broadway, New York, NY 10001",
  "city": "New York",
  "total_screens": 5,
  "facilities": ["IMAX", "Dolby Atmos", "Parking"]
}
```

### Screens Endpoints

#### Get Screens by Theater
```http
GET /api/v1/theaters/:theaterId/screens
```

#### Create Screen (Admin)
```http
POST /api/v1/screens
Authorization: Bearer <token>
Content-Type: application/json

{
  "theater_id": "theater_id_here",
  "name": "Screen 1 - IMAX",
  "total_seats": 120,
  "rows": 10,
  "columns": 12
}
```

### Seats Endpoints

#### Get Seats by Screen
```http
GET /api/v1/screens/:screenId/seats
```

#### Create Seats in Bulk (Admin)
```http
POST /api/v1/screens/:screenId/seats/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "seats": [
    { "row": "A", "column": 1, "seat_type": "regular" },
    { "row": "A", "column": 2, "seat_type": "regular" },
    { "row": "B", "column": 1, "seat_type": "premium" }
  ]
}
```

### Shows Endpoints

#### Get Shows by Movie
```http
GET /api/v1/movies/:movieId/shows?theater_id=...&date=2025-10-30
```

#### Get Show by ID
```http
GET /api/v1/shows/:id
```

#### Get Available Seats for Show
```http
GET /api/v1/shows/:showId/seats
```

#### Create Show (Admin)
```http
POST /api/v1/shows
Authorization: Bearer <token>
Content-Type: application/json

{
  "movie_id": "movie_id_here",
  "screen_id": "screen_id_here",
  "theater_id": "theater_id_here",
  "show_date": "2025-11-15",
  "show_time": "18:00",
  "price": 15.99
}
```

### Bookings Endpoints

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "show_id": "show_id_here",
  "seat_ids": ["seat_id_1", "seat_id_2"],
  "payment_method": "card",
  "payment_details": {
    "card_number": "************1234",
    "transaction_id": "txn_123456"
  }
}
```

#### Get User Bookings
```http
GET /api/v1/bookings/user?status=confirmed&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Booking by ID
```http
GET /api/v1/bookings/:id
Authorization: Bearer <token>
```

#### Cancel Booking
```http
PUT /api/v1/bookings/:id/cancel
Authorization: Bearer <token>
```

#### Get All Bookings (Admin)
```http
GET /api/v1/bookings?theater_id=...&status=confirmed
Authorization: Bearer <token>
```

### User Management Endpoints (Super Admin)

#### Get All Users
```http
GET /api/v1/users?role=user&search=john&page=1
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/v1/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "theater_admin",
  "theater_id": "theater_id_here"
}
```

#### Deactivate User
```http
PUT /api/v1/users/:id/deactivate
Authorization: Bearer <token>
```

#### Activate User
```http
PUT /api/v1/users/:id/activate
Authorization: Bearer <token>
```

### Analytics Endpoints (Admin)

#### Get Dashboard Analytics
```http
GET /api/v1/analytics/dashboard?theater_id=...&date_from=2025-01-01&date_to=2025-12-31
Authorization: Bearer <token>
```

#### Get Sales Report
```http
GET /api/v1/analytics/sales?date_from=2025-01-01&date_to=2025-12-31&group_by=daily
Authorization: Bearer <token>
```

## User Roles

1. **user**: Regular users who can book tickets
2. **theater_admin**: Can manage movies, shows, and screens for their theater
3. **super_admin**: Full access to all features including user management and theater creation

## Rate Limiting

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Admin endpoints**: 2000 requests per 15 minutes per user

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": [ ... ]
  }
}
```

## Project Structure

```
projectbackend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── movieController.js    # Movie CRUD operations
│   ├── theaterController.js  # Theater CRUD operations
│   ├── screenController.js   # Screen CRUD operations
│   ├── seatController.js     # Seat CRUD operations
│   ├── showController.js     # Show CRUD operations
│   ├── bookingController.js  # Booking logic
│   ├── userController.js     # User management
│   └── analyticsController.js # Analytics and reports
├── middleware/
│   ├── auth.js               # Authentication & authorization
│   ├── errorHandler.js       # Global error handler
│   └── rateLimiter.js        # Rate limiting
├── models/
│   ├── User.js               # User schema
│   ├── Movie.js              # Movie schema
│   ├── Theater.js            # Theater schema
│   ├── Screen.js             # Screen schema
│   ├── Seat.js               # Seat schema
│   ├── Show.js               # Show schema
│   └── Booking.js            # Booking schema
├── routes/
│   ├── auth.js               # Auth routes
│   ├── movies.js             # Movie routes
│   ├── theaters.js           # Theater routes
│   ├── screens.js            # Screen routes
│   ├── shows.js              # Show routes
│   ├── bookings.js           # Booking routes
│   ├── users.js              # User routes
│   └── analytics.js          # Analytics routes
├── utils/
│   ├── jwt.js                # JWT utilities
│   └── errorResponse.js      # Custom error class
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
├── server.js                 # Application entry point
└── README.md                 # This file
```

## Development Guidelines

1. **Adding New Routes**: Create a new route file in `routes/` and register it in `server.js`
2. **Adding Controllers**: Create controller functions in `controllers/` and import them in routes
3. **Adding Models**: Create Mongoose schemas in `models/`
4. **Adding Middleware**: Create middleware functions in `middleware/`

## Testing

You can test the API using:
- Postman
- Insomnia
- curl
- Any HTTP client

Example curl request:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
```

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the `MONGODB_URI` in `.env` is correct
- Ensure your MongoDB instance is accessible

### Port Already in Use
- Change the `PORT` in `.env` file
- Or kill the process using the port

### JWT Token Errors
- Make sure you're sending the token in the correct format: `Authorization: Bearer <token>`
- Verify the `JWT_SECRET` is set in `.env`

## Documentation Files

- **README.md**: Main documentation (this file)
- **SWAGGER_GUIDE.md**: Detailed Swagger UI usage guide
- **API_DOCUMENTATION.md**: Complete API specification
- **.env.example**: Environment configuration template

## Future Enhancements

- [ ] WebSocket implementation for real-time seat availability
- [ ] Email notifications
- [ ] File upload for movie posters
- [ ] Advanced search and filtering
- [ ] Caching with Redis

## License

ISC

## Author

AkshayPanchivala 
