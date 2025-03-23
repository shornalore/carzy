const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get cars for comparison
router.post('/', async (req, res) => {
  try {
    const { carIds } = req.body;
    
    if (!carIds || !Array.isArray(carIds) || carIds.length < 2) {
      return res.status(400).json({ message: 'At least two car IDs are required' });
    }
    
    const cars = [];
    
    for (const id of carIds) {
      // Get car details
      const carResult = await db.query('SELECT * FROM cars WHERE id = $1', [id]);
      
      if (carResult.rows.length === 0) {
        return res.status(404).json({ message: `Car with ID ${id} not found` });
      }
      
      const car = carResult.rows[0];
      
      // Get car features
      const featuresResult = await db.query('SELECT * FROM car_features WHERE car_id = $1', [id]);
      car.features = featuresResult.rows[0] || {};
      
      cars.push(car);
    }
    
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
