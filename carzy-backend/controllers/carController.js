const db = require('../config/db');

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cars');
    
    // For each car, get its features, variants, and gallery
    const cars = await Promise.all(result.rows.map(async (car) => {
      const features = await db.query('SELECT * FROM car_features WHERE car_id = $1', [car.id]);
      const variants = await db.query('SELECT * FROM car_variants WHERE car_id = $1', [car.id]);
      const gallery = await db.query('SELECT image_url FROM car_gallery WHERE car_id = $1', [car.id]);
      
      return {
        ...car,
        features: features.rows[0] || {},
        variants: variants.rows || [],
        gallery: gallery.rows.map(img => img.image_url) || []
      };
    }));
    
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM cars WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    const car = result.rows[0];
    
    // Get car features
    const featuresResult = await db.query('SELECT * FROM car_features WHERE car_id = $1', [id]);
    car.features = featuresResult.rows[0] || {};
    
    // Get car variants
    const variantsResult = await db.query('SELECT * FROM car_variants WHERE car_id = $1', [id]);
    car.variants = variantsResult.rows || [];
    
    // Get car gallery
    const galleryResult = await db.query('SELECT image_url FROM car_gallery WHERE car_id = $1', [id]);
    car.gallery = galleryResult.rows.map(img => img.image_url) || [];
    
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
