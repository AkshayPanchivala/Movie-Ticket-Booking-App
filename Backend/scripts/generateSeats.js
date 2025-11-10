const mongoose = require('mongoose');
require('dotenv').config();

const Seat = require('../models/Seat');
const Screen = require('../models/Screen');

async function generateSeatsForScreen(screenId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const screen = await Screen.findById(screenId);
    if (!screen) {
      return;
    }


    // Check if seats already exist
    const existingSeats = await Seat.find({ screen_id: screenId });
    if (existingSeats.length > 0) {
      await mongoose.connection.close();
      return;
    }

    // Generate seats
    const seats = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < screen.rows; r++) {
      for (let c = 1; c <= screen.columns; c++) {
        const rowLetter = rowLetters[r];
        const seatNumber = `${rowLetter}${c}`;

        // First 2 rows are premium, rest are regular
        const seatType = r < 2 ? 'premium' : 'regular';

        seats.push({
          screen_id: screen._id,
          row: rowLetter,
          column: c,
          seat_number: seatNumber,
          seat_type: seatType,
          is_active: true
        });
      }
    }

   

    const result = await Seat.insertMany(seats);

   

    await mongoose.connection.close();
  } catch (error) {
    process.exit(1);
  }
}

const screenId = process.argv[2];
if (!screenId) {
 
  process.exit(1);
}

generateSeatsForScreen(screenId);
