const express = require('express');
const router = express.Router();
const { 
  getLatestData, 
  getDataByDeviceId, 
  createData, 
  deleteData 
} = require('../controllers/dataController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/latest', getLatestData);
router.get('/device/:deviceId', getDataByDeviceId);

// Protected routes (admin only)
router.post('/', protect, admin, createData);
router.delete('/:id', protect, admin, deleteData);

module.exports = router; 