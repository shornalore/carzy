const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Get all cars
router.get('/', carController.getAllCars);

// Get car by ID
router.get('/:id', carController.getCarById);

module.exports = router;
