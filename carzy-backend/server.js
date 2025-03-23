const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const carRoutes = require('./routes/cars');
const reviewRoutes = require('./routes/reviews');
const compareRoutes = require('./routes/compare');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route middlewares
app.use('/api/cars', carRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/compare', compareRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Carzy API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
