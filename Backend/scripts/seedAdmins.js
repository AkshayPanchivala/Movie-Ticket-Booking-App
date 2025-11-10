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
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);

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
          console.log(`🔄 Updated ${userData.email} to ${userData.role}`);
          updated++;
        } else {
          console.log(`⚠️  User ${userData.email} already exists with correct role`);
          skipped++;
        }
      } else {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
        created++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Admin users seed completed!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${created} users`);
    console.log(`   - Updated: ${updated} users`);
    console.log(`   - Skipped: ${skipped} users`);
    console.log('='.repeat(60));

    console.log('\n📋 Login Credentials:');
    console.log('─'.repeat(60));
    adminUsers.forEach(user => {
      console.log(`\n👤 ${user.full_name}`);
      console.log(`   Role:     ${user.role}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: ${user.password}`);
    });
    console.log('\n' + '─'.repeat(60));

    console.log('\n⚠️  IMPORTANT:');
    console.log('   1. Change these passwords after first login!');
    console.log('   2. Keep credentials secure');
    console.log('   3. Only share with authorized personnel\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admins:', error.message);
    console.error('Stack trace:', error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed
seedAdmins();
