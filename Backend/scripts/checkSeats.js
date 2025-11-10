const mongoose = require('mongoose');
require('dotenv').config();

const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Screen = require('../models/Screen');

async function checkShowSeats(showId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const show = await Show.findById(showId).populate('screen_id');
    if (!show) {
      console.log('Show not found');
      return;
    }

    console.log('\n=== SHOW DETAILS ===');
    console.log('Show ID:', show._id);
    console.log('Screen ID:', show.screen_id._id);
    console.log('Screen Name:', show.screen_id.name);
    console.log('Expected Total Seats:', show.screen_id.total_seats);

    const seats = await Seat.find({ screen_id: show.screen_id._id });
    console.log('\n=== SEAT STATUS ===');
    console.log('Actual Seats Found:', seats.length);

    if (seats.length === 0) {
      console.log('\n⚠️  NO SEATS FOUND FOR THIS SCREEN!');
      console.log('Solution: Generate seats for screen:', show.screen_id.name);
      console.log('Screen details:', {
        rows: show.screen_id.rows,
        columns: show.screen_id.columns,
        total_seats: show.screen_id.total_seats
      });
    } else {
      console.log('✅ Seats exist for this screen');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const showId = process.argv[2];
if (!showId) {
  console.log('Usage: node checkSeats.js <show_id>');
  process.exit(1);
}

checkShowSeats(showId);
