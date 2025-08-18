const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'nyeristays@gmail.com' }).select('+password');
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('Is Active:', adminUser.isActive);
    console.log('Is Email Verified:', adminUser.isEmailVerified);
    console.log('Password hash exists:', !!adminUser.password);
    console.log('Password hash length:', adminUser.password ? adminUser.password.length : 0);

    // Test password comparison
    const testPassword = 'Emmanuel001.';
    const isMatch = await adminUser.comparePassword(testPassword);
    console.log('Password match test:', isMatch);

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmin(); 