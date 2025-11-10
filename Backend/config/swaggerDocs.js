/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: securePassword123
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         full_name:
 *                           type: string
 *                     token:
 *                       type: string
 *                     profile:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Authenticate user and get access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *                     profile:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout user
 *     description: Logout current user (client-side token removal)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     description: Retrieve the profile of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Get all movies
 *     description: Retrieve a paginated list of all active movies
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or director
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     movies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Movie'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get movie by ID
 *     description: Retrieve a single movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create a new movie
 *     description: Create a new movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - poster_url
 *               - director
 *               - genre
 *               - language
 *               - duration
 *               - runtime
 *               - release_date
 *             properties:
 *               title:
 *                 type: string
 *                 example: New Movie
 *               description:
 *                 type: string
 *                 example: Movie description
 *               poster_url:
 *                 type: string
 *                 example: https://example.com/poster.jpg
 *               trailer_url:
 *                 type: string
 *                 example: https://youtube.com/watch?v=...
 *               director:
 *                 type: string
 *                 example: Director Name
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Action', 'Adventure']
 *               language:
 *                 type: string
 *                 example: English
 *               duration:
 *                 type: number
 *                 example: 120
 *               movie_cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Actor 1', 'Actor 2']
 *               rating:
 *                 type: number
 *                 example: 8.0
 *               runtime:
 *                 type: number
 *                 example: 120
 *               release_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-01
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     tags: [Movies]
 *     summary: Update a movie
 *     description: Update movie details (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie
 *     description: Soft delete a movie (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /theaters:
 *   get:
 *     tags: [Theaters]
 *     summary: Get all theaters
 *     description: Retrieve a paginated list of all active theaters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: Theaters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     theaters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Theater'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /theaters/{id}:
 *   get:
 *     tags: [Theaters]
 *     summary: Get theater by ID
 *     description: Retrieve a single theater with its screens
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater ID
 *     responses:
 *       200:
 *         description: Theater retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Theater'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /theaters:
 *   post:
 *     tags: [Theaters]
 *     summary: Create a new theater
 *     description: Create a new theater (Super Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - city
 *               - total_screens
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Theater
 *               location:
 *                 type: string
 *                 example: 456 Main St, City, State 12345
 *               city:
 *                 type: string
 *                 example: City Name
 *               total_screens:
 *                 type: number
 *                 example: 3
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Parking', 'Food Court']
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /theaters/{theaterId}/screens:
 *   get:
 *     tags: [Screens]
 *     summary: Get screens by theater
 *     description: Retrieve all screens for a specific theater
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater ID
 *     responses:
 *       200:
 *         description: Screens retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Screen'
 */

/**
 * @swagger
 * /screens/{id}:
 *   get:
 *     tags: [Screens]
 *     summary: Get screen by ID
 *     description: Retrieve a single screen by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     responses:
 *       200:
 *         description: Screen retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /screens:
 *   post:
 *     tags: [Screens]
 *     summary: Create a new screen
 *     description: Create a new screen (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theater_id
 *               - name
 *               - total_seats
 *               - rows
 *               - columns
 *             properties:
 *               theater_id:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: Screen 3 - Premium
 *               total_seats:
 *                 type: number
 *                 example: 100
 *               rows:
 *                 type: number
 *                 example: 10
 *               columns:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Screen created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /screens/{screenId}/seats:
 *   get:
 *     tags: [Seats]
 *     summary: Get seats by screen
 *     description: Retrieve all seats for a specific screen
 *     parameters:
 *       - in: path
 *         name: screenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     responses:
 *       200:
 *         description: Seats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seat'
 */

/**
 * @swagger
 * /screens/{screenId}/seats/bulk:
 *   post:
 *     tags: [Seats]
 *     summary: Create seats in bulk
 *     description: Create multiple seats at once (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: screenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Screen ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seats
 *             properties:
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     row:
 *                       type: string
 *                       example: A
 *                     column:
 *                       type: number
 *                       example: 1
 *                     seat_type:
 *                       type: string
 *                       enum: [regular, premium, vip]
 *                       example: regular
 *     responses:
 *       201:
 *         description: Seats created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /movies/{movieId}/shows:
 *   get:
 *     tags: [Shows]
 *     summary: Get shows by movie
 *     description: Retrieve all shows for a specific movie
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: query
 *         name: theater_id
 *         schema:
 *           type: string
 *         description: Filter by theater
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: Shows retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Show'
 */

/**
 * @swagger
 * /shows/{id}:
 *   get:
 *     tags: [Shows]
 *     summary: Get show by ID
 *     description: Retrieve a single show by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Show ID
 *     responses:
 *       200:
 *         description: Show retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /shows:
 *   post:
 *     tags: [Shows]
 *     summary: Create a new show
 *     description: Create a new show (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - screen_id
 *               - theater_id
 *               - show_date
 *               - show_time
 *               - price
 *             properties:
 *               movie_id:
 *                 type: string
 *               screen_id:
 *                 type: string
 *               theater_id:
 *                 type: string
 *               show_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-15
 *               show_time:
 *                 type: string
 *                 example: '18:00'
 *               price:
 *                 type: number
 *                 example: 15.99
 *     responses:
 *       201:
 *         description: Show created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /shows/{showId}/seats:
 *   get:
 *     tags: [Shows]
 *     summary: Get available seats for show
 *     description: Retrieve all seats with booking status for a specific show
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema:
 *           type: string
 *         description: Show ID
 *     responses:
 *       200:
 *         description: Seats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     show:
 *                       type: object
 *                     seats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           seat_number:
 *                             type: string
 *                           seat_type:
 *                             type: string
 *                           is_booked:
 *                             type: boolean
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     description: Book tickets for a show
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - show_id
 *               - seat_ids
 *               - payment_method
 *             properties:
 *               show_id:
 *                 type: string
 *               seat_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['seat_id_1', 'seat_id_2']
 *               payment_method:
 *                 type: string
 *                 enum: [card, upi, netbanking, wallet]
 *                 example: card
 *               payment_details:
 *                 type: object
 *                 example: { card_number: '************1234', transaction_id: 'txn_123456' }
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Seats already booked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: CONFLICT
 *                     message:
 *                       type: string
 *                       example: Seats already booked
 *                     details:
 *                       type: object
 *                       properties:
 *                         booked_seats:
 *                           type: array
 *                           items:
 *                             type: string
 */

/**
 * @swagger
 * /bookings/user:
 *   get:
 *     tags: [Bookings]
 *     summary: Get user bookings
 *     description: Retrieve all bookings for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     description: Retrieve a single booking by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     tags: [Bookings]
 *     summary: Cancel booking
 *     description: Cancel a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings (Admin)
 *     description: Retrieve all bookings (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: theater_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Super Admin)
 *     description: Retrieve all users with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, theater_admin, super_admin]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     tags: [Users]
 *     summary: Update user role (Super Admin)
 *     description: Update a user's role and theater assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, theater_admin, super_admin]
 *               theater_id:
 *                 type: string
 *                 description: Required if role is theater_admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /users/{id}/deactivate:
 *   put:
 *     tags: [Users]
 *     summary: Deactivate user (Super Admin)
 *     description: Deactivate a user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /users/{id}/activate:
 *   put:
 *     tags: [Users]
 *     summary: Activate user (Super Admin)
 *     description: Activate a user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Get dashboard analytics (Admin)
 *     description: Retrieve comprehensive analytics for dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: theater_id
 *         schema:
 *           type: string
 *         description: Filter by theater (optional for super_admin)
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         total_bookings:
 *                           type: number
 *                         total_revenue:
 *                           type: number
 *                         total_users:
 *                           type: number
 *                         total_movies:
 *                           type: number
 *                         total_theaters:
 *                           type: number
 *                         total_shows:
 *                           type: number
 *                     bookings_by_date:
 *                       type: array
 *                       items:
 *                         type: object
 *                     popular_movies:
 *                       type: array
 *                       items:
 *                         type: object
 *                     theater_performance:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /analytics/sales:
 *   get:
 *     tags: [Analytics]
 *     summary: Get sales report (Admin)
 *     description: Retrieve sales analytics with grouping options
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: theater_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: daily
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_bookings:
 *                           type: number
 *                         total_revenue:
 *                           type: number
 *                         average_ticket_price:
 *                           type: number
 *                         total_seats_sold:
 *                           type: number
 *                     sales_by_period:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

module.exports = {};
