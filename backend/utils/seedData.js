require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const DeviceData = require('../models/DeviceData');

// Connect to MongoDB
connectDB();

// Function to generate random temperature (15-35°C)
const generateTemperature = () => {
  return parseFloat((Math.random() * 20 + 15).toFixed(1));
};

// Function to generate random humidity (30-90%)
const generateHumidity = () => {
  return parseFloat((Math.random() * 60 + 30).toFixed(1));
};

// Generate timestamps for the last 24 hours with 1-hour intervals
const generateTimestamps = (count) => {
  const timestamps = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i);
    timestamps.push(timestamp);
  }
  
  return timestamps;
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await DeviceData.deleteMany({});
    console.log('Deleted existing device data');
    
    // Device IDs
    const deviceIds = ['device001', 'device002'];
    const timestamps = generateTimestamps(24);
    
    // Create data entries
    const dataEntries = [];
    
    for (const deviceId of deviceIds) {
      for (const timestamp of timestamps) {
        dataEntries.push({
          deviceId,
          temperature: generateTemperature(),
          humidity: generateHumidity(),
          timestamp
        });
      }
    }
    
    // Insert data
    await DeviceData.insertMany(dataEntries);
    console.log(`Added ${dataEntries.length} device data entries`);
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 