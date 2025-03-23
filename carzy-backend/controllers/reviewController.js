const db = require('../config/db');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, c.name as car_name, c.image 
      FROM reviews r
      JOIN cars c ON r.car_id = c.id
      ORDER BY r.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews for a specific car
exports.getCarReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM reviews WHERE car_id = $1 ORDER BY created_at DESC', [id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { car_id, reviewer_name, review_title, rating, review_content } = req.body;
    
    // Validate input
    if (!car_id || !reviewer_name || !review_title || !rating || !review_content) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if car exists
    const carCheck = await db.query('SELECT id FROM cars WHERE id = $1', [car_id]);
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    const result = await db.query(
      'INSERT INTO reviews (car_id, reviewer_name, review_title, rating, review_content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [car_id, reviewer_name, review_title, rating, review_content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
