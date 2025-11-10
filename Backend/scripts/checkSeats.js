const mongoose = require('mongoose');
require('dotenv').config();

const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Screen = require('../models/Screen');

async function checkShowSeats(showId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const show = await Show.findById(showId).populate('screen_id');
    if (!show) {
      return;
    }

  

    const seats = await Seat.find({ screen_id: show.screen_id._id });
 


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
