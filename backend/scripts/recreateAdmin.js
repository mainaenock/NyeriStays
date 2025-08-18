const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const recreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'nyeristays@gmail.com' });
    console.log('Deleted existing admin user');

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Emmanuel001.', salt);

    // Create new admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Nyeri Stays',
      email: 'nyeristays@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isEmailVerified: true,
      isActive: true,
      phone: '+254700000000',
      address: {
        street: 'Admin Address',
        city: 'Nyeri',
        state: 'Central',
        zipCode: '10100',
        country: 'Kenya'
      }
    });

    await adminUser.save();
    console.log('New admin user created successfully');
    console.log('Email: nyeristays@gmail.com');
    console.log('Password: Emmanuel001.');

    // Test the password
    const isMatch = await adminUser.comparePassword('Emmanuel001.');
    console.log('Password test result:', isMatch);

  } catch (error) {
    console.error('Error recreating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

recreateAdmin(); 