const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'nyeristays@gmail.com' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Emmanuel001.', salt);
    
    // Update password
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('Admin password reset successfully');
    console.log('Email: nyeristays@gmail.com');
    console.log('Password: Emmanuel001.');

    // Test the password
    const isMatch = await adminUser.comparePassword('Emmanuel001.');
    console.log('Password test result:', isMatch);

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAdminPassword(); 