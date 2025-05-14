const DeviceData = require('../models/DeviceData');

/**
 * @desc    Get latest device data (limited to 10 records)
 * @route   GET /api/data/latest
 * @access  Public
 */
exports.getLatestData = async (req, res) => {
  try {
    const data = await DeviceData.find()
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Get data by device ID
 * @route   GET /api/data/device/:deviceId
 * @access  Public
 */
exports.getDataByDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = await DeviceData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Create new device data
 * @route   POST /api/data
 * @access  Protected (admin only)
 */
exports.createData = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to create device data'
      });
    }

    const { deviceId, temperature, humidity } = req.body;

    // Validate required fields
    if (!deviceId || temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide deviceId, temperature, and humidity'
      });
    }

    const deviceData = await DeviceData.create({
      deviceId,
      temperature,
      humidity
    });

    res.status(201).json({
      success: true,
      data: deviceData
    });
  } catch (error) {
    console.error('Error creating device data:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * @desc    Delete device data by ID
 * @route   DELETE /api/data/:id
 * @access  Protected (admin only)
 */
exports.deleteData = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete device data'
      });
    }

    const deviceData = await DeviceData.findById(req.params.id);

    if (!deviceData) {
      return res.status(404).json({
        success: false,
        error: 'Device data not found'
      });
    }

    await deviceData.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting device data:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 