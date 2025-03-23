const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Get all reviews
router.get('/', reviewController.getAllReviews);

// Get reviews for a specific car
router.get('/car/:id', reviewController.getCarReviews);

// Add a new review
router.post('/', reviewController.addReview);

module.exports = router;
