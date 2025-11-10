const mongoose = require('mongoose');
require('dotenv').config();

const Seat = require('../models/Seat');
const Screen = require('../models/Screen');

async function generateSeatsForScreen(screenId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const screen = await Screen.findById(screenId);
    if (!screen) {
      console.log('Screen not found');
      return;
    }

    console.log('\n=== SCREEN DETAILS ===');
    console.log('Screen ID:', screen._id);
    console.log('Screen Name:', screen.name);
    console.log('Rows:', screen.rows);
    console.log('Columns:', screen.columns);
    console.log('Total Seats:', screen.total_seats);

    // Check if seats already exist
    const existingSeats = await Seat.find({ screen_id: screenId });
    if (existingSeats.length > 0) {
      console.log(`\n⚠️  This screen already has ${existingSeats.length} seats!`);
      console.log('Do you want to delete and regenerate? (manually delete from DB if needed)');
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

    console.log(`\n=== GENERATING SEATS ===`);
    console.log(`Creating ${seats.length} seats...`);

    const result = await Seat.insertMany(seats);

    console.log(`\n✅ Successfully created ${result.length} seats!`);
    console.log('Seat layout:');
    console.log(`- Premium seats (rows A-B): ${screen.columns * 2}`);
    console.log(`- Regular seats: ${seats.length - (screen.columns * 2)}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const screenId = process.argv[2];
if (!screenId) {
  console.log('Usage: node generateSeats.js <screen_id>');
  console.log('Example: node generateSeats.js 6906eef8e37d1fd6b10ae2cd');
  process.exit(1);
}

generateSeatsForScreen(screenId);
