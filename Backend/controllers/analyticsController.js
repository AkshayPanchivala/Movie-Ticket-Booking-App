const { Booking } = require('../models/Booking');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private (theater_admin, super_admin)
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const { theater_id, date_from, date_to } = req.query;

    // Build date filter
    const dateFilter = {};
    if (date_from || date_to) {
      dateFilter.booking_date = {};
      if (date_from) {
        dateFilter.booking_date.$gte = new Date(date_from);
      }
      if (date_to) {
        dateFilter.booking_date.$lte = new Date(date_to);
      }
    }

    // Get all bookings
    let bookings = await Booking.find({
      ...dateFilter,
      status: { $in: ['confirmed', 'completed'] }
    }).populate({
      path: 'show_id',
      populate: [
        { path: 'movie_id' },
        { path: 'theater_id' }
      ]
    });

    // Filter out bookings with missing show/movie/theater data (deleted references)
    bookings = bookings.filter(b =>
      b.show_id && b.show_id.movie_id && b.show_id.theater_id
    );

    // Filter by theater if theater_admin or theater_id specified
    if (req.user.role === 'theater_admin' && req.user.theater_id) {
      bookings = bookings.filter(b =>
        b.show_id.theater_id._id.toString() === req.user.theater_id.toString()
      );
    } else if (theater_id) {
      bookings = bookings.filter(b =>
        b.show_id.theater_id._id.toString() === theater_id
      );
    }

    // Overview statistics
    const total_bookings = bookings.length;
    const total_revenue = bookings.reduce((sum, b) => sum + b.total_amount, 0);
    const total_users = await User.countDocuments();
    const total_movies = await Movie.countDocuments({ is_active: true });
    const total_theaters = await Theater.countDocuments({ is_active: true });
    const total_shows = await Show.countDocuments({ is_active: true });

    // Bookings by date
    const bookingsByDate = {};
    bookings.forEach(booking => {
      const date = booking.booking_date.toISOString().split('T')[0];
      if (!bookingsByDate[date]) {
        bookingsByDate[date] = { date, count: 0, revenue: 0 };
      }
      bookingsByDate[date].count++;
      bookingsByDate[date].revenue += booking.total_amount;
    });

    // Popular movies
    const movieStats = {};
    bookings.forEach(booking => {
      if (!booking.show_id || !booking.show_id.movie_id) return;

      const movieId = booking.show_id.movie_id._id.toString();
      if (!movieStats[movieId]) {
        movieStats[movieId] = {
          movie_id: movieId,
          title: booking.show_id.movie_id.title,
          total_bookings: 0,
          revenue: 0
        };
      }
      movieStats[movieId].total_bookings++;
      movieStats[movieId].revenue += booking.total_amount;
    });

    const popular_movies = Object.values(movieStats)
      .sort((a, b) => b.total_bookings - a.total_bookings)
      .slice(0, 10);

    // Theater performance
    const theaterStats = {};
    bookings.forEach(booking => {
      if (!booking.show_id || !booking.show_id.theater_id) return;

      const theaterId = booking.show_id.theater_id._id.toString();
      if (!theaterStats[theaterId]) {
        theaterStats[theaterId] = {
          theater_id: theaterId,
          name: booking.show_id.theater_id.name,
          total_bookings: 0,
          revenue: 0
        };
      }
      theaterStats[theaterId].total_bookings++;
      theaterStats[theaterId].revenue += booking.total_amount;
    });

    const theater_performance = Object.values(theaterStats).map(stat => ({
      ...stat,
      occupancy_rate: 0 // This would require more complex calculation with show and seat data
    }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total_bookings,
          total_revenue,
          total_users,
          total_movies,
          total_theaters,
          total_shows
        },
        bookings_by_date: Object.values(bookingsByDate).sort((a, b) =>
          new Date(a.date) - new Date(b.date)
        ),
        popular_movies,
        theater_performance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales report
// @route   GET /api/v1/analytics/sales
// @access  Private (theater_admin, super_admin)
exports.getSalesReport = async (req, res, next) => {
  try {
    const { theater_id, date_from, date_to, group_by = 'daily' } = req.query;

    if (!date_from || !date_to) {
      return next(new ErrorResponse('date_from and date_to are required', 400, 'VALIDATION_ERROR'));
    }

    // Create date range that includes the full day
    const startDate = new Date(date_from);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date_to);
    endDate.setHours(23, 59, 59, 999);

    const dateFilter = {
      booking_date: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['confirmed', 'completed'] }
    };

    let bookings = await Booking.find(dateFilter)
      .populate({
        path: 'show_id',
        populate: { path: 'theater_id' }
      })
      .populate('booking_seats');

    // Filter out bookings with missing show/theater data (deleted references)
    bookings = bookings.filter(b =>
      b.show_id && b.show_id.theater_id
    );

    // Filter by theater
    if (req.user.role === 'theater_admin' && req.user.theater_id) {
     
      bookings = bookings.filter(b =>
        b.show_id && b.show_id.theater_id && b.show_id.theater_id._id.toString() === req.user.theater_id.toString()
      );
    } else if (theater_id) {
      bookings = bookings.filter(b =>
        b.show_id && b.show_id.theater_id && b.show_id.theater_id._id.toString() === theater_id
      );
    }

  

    // Summary
    const total_bookings = bookings.length;
    const total_revenue = bookings.reduce((sum, b) => sum + b.total_amount, 0);
    const total_seats_sold = bookings.reduce((sum, b) => sum + (b.booking_seats?.length || 0), 0);
    const average_ticket_price = total_seats_sold > 0 ? total_revenue / total_seats_sold : 0;

    // Sales by period
    const salesByPeriod = {};
    bookings.forEach(booking => {
      let period;
      const date = new Date(booking.booking_date);

      if (group_by === 'daily') {
        period = date.toISOString().split('T')[0];
      } else if (group_by === 'weekly') {
        const week = Math.ceil(date.getDate() / 7);
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-W${week}`;
      } else if (group_by === 'monthly') {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!salesByPeriod[period]) {
        salesByPeriod[period] = {
          period,
          bookings: 0,
          revenue: 0,
          seats_sold: 0
        };
      }
      salesByPeriod[period].bookings++;
      salesByPeriod[period].revenue += booking.total_amount;
      salesByPeriod[period].seats_sold += booking.booking_seats?.length || 0;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total_bookings,
          total_revenue,
          average_ticket_price,
          total_seats_sold
        },
        sales_by_period: Object.values(salesByPeriod).sort((a, b) =>
          a.period.localeCompare(b.period)
        )
      }
    });
  } catch (error) {
    next(error);
  }
};
