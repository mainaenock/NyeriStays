// Script to update all properties in the database to add a default hostPhone if missing
// Usage: node scripts/fixMissingHostPhone.js

const mongoose = require('mongoose');
const Property = require('../models/Property');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nyeristays';
const DEFAULT_PHONE = '+254700000000'; // Change this to a real default or prompt for manual update

async function updateProperties() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Property.updateMany(
    { $or: [
      { hostPhone: { $exists: false } },
      { hostPhone: null },
      { hostPhone: "" }
    ] },
    { $set: { hostPhone: DEFAULT_PHONE } }
  );
  console.log(`Updated ${result.modifiedCount || result.nModified} properties.`);
  await mongoose.disconnect();
}

updateProperties().catch(err => {
  console.error('Error updating properties:', err);
  process.exit(1);
});
