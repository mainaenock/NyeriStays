const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Hash password manually
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Emmanuel001.', salt);

    // Update admin user directly in database
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'nyeristays@gmail.com' },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('Admin password updated successfully');
      console.log('Email: nyeristays@gmail.com');
      console.log('Password: Emmanuel001.');
    } else {
      console.log('Admin user not found');
    }

  } catch (error) {
    console.error('Error fixing admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixAdminPassword(); 