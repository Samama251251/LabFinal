const mongoose = require('mongoose');

const deviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    trim: true
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required']
  },
  humidity: {
    type: Number,
    required: [true, 'Humidity is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
deviceDataSchema.index({ deviceId: 1, timestamp: -1 });

const DeviceData = mongoose.model('DeviceData', deviceDataSchema);

module.exports = DeviceData; 