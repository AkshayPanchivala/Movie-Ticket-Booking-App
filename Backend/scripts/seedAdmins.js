require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const adminUsers = [
  {
    email: 'superadmin@cinehub.com',
    password: 'SuperAdmin@123',
    full_name: 'Super Administrator',
    role: 'super_admin',
    is_active: true
  },
  {
    email: 'admin@cinehub.com',
    password: 'Admin@123',
    full_name: 'Theater Administrator',
    role: 'theater_admin',
    is_active: true,
    // Note: You can add theater_id after creating theaters
    // theater_id: 'theater_id_here'
  },
  {
    email: 'user@cinehub.com',
    password: 'User@123',
    full_name: 'Regular User',
    role: 'user',
    is_active: true
  }
];

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinehub';
    await mongoose.connect(mongoUri);
    

    // Create admin users
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const userData of adminUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        // Update role if needed
        if (existingUser.role !== userData.role) {
          existingUser.role = userData.role;
          if (userData.theater_id) {
            existingUser.theater_id = userData.theater_id;
          }
          await existingUser.save();
          updated++;
        } else {
          skipped++;
        }
      } else {
        await User.create(userData);
        created++;
      }
    }
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed
seedAdmins();
