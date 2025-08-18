const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'nyeristays@gmail.com' });
    
    if (existingAdmin) {
      // Update existing admin password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Emmanuel001.', salt);
      
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('Admin user password updated successfully');
      console.log('Email: nyeristays@gmail.com');
      console.log('Password: Emmanuel001.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Emmanuel001.', salt);

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Nyeri Stays',
      email: 'nyeristays@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isEmailVerified: true,
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
    console.log('Admin user created successfully');
    console.log('Email: nyeristays@gmail.com');
    console.log('Password: Emmanuel001.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 