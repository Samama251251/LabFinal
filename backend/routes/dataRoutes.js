const express = require('express');
const router = express.Router();
const { 
  getLatestData, 
  getDataByDeviceId, 
  createData, 
  deleteData 
} = require('../controllers/dataController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/latest', getLatestData);
router.get('/device/:deviceId', getDataByDeviceId);

// Protected routes (admin only)
router.post('/', protect, createData);
router.delete('/:id', protect, deleteData);

module.exports = router; 