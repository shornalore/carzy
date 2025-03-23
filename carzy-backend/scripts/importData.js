const db = require('../config/db');
const carData = require('../data/carData'); // You'll need to copy your data.js content here

const importData = async () => {
  try {
    console.log('Starting data import...');
    
    for (const car of carData) {
      // Insert car
      await db.query(`
        INSERT INTO cars (
          id, name, brand, price, image, engine, engine_type, power, torque, 
          fuel_type, transmission, mileage, seating, body_type, length, width, 
          height, wheelbase, ground_clearance, boot_space, fuel_tank_capacity, 
          safety_rating, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (id) DO NOTHING
      `, [
        car.id, car.name, car.brand, car.price, car.image, car.engine, car.engineType, 
        car.power, car.torque, car.fuelType, car.transmission, car.mileage, car.seating, 
        car.bodyType, car.length, car.width, car.height, car.wheelbase, car.groundClearance, 
        car.bootSpace, car.fuelTankCapacity, car.safetyRating, car.description
      ]);
      
      // Insert car features
      if (car.features) {
        await db.query(`
          INSERT INTO car_features (
            car_id, ac, power_steering, power_windows, abs, airbags, 
            infotainment, parking_sensors, reverse_camera, sunroof, hill_assist
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (car_id) DO UPDATE SET
            ac = EXCLUDED.ac,
            power_steering = EXCLUDED.power_steering,
            power_windows = EXCLUDED.power_windows,
            abs = EXCLUDED.abs,
            airbags = EXCLUDED.airbags,
            infotainment = EXCLUDED.infotainment,
            parking_sensors = EXCLUDED.parking_sensors,
            reverse_camera = EXCLUDED.reverse_camera,
            sunroof = EXCLUDED.sunroof,
            hill_assist = EXCLUDED.hill_assist
        `, [
          car.id, car.features.ac, car.features.powerSteering, car.features.powerWindows, 
          car.features.abs, car.features.airbags, car.features.infotainment, 
          car.features.parkingSensors, car.features.reverseCamera, car.features.sunroof, 
          car.features.hillAssist
        ]);
      }
      
      // Insert car variants
      if (car.variants && car.variants.length > 0) {
        for (const variant of car.variants) {
          await db.query(`
            INSERT INTO car_variants (car_id, name, price, features)
            VALUES ($1, $2, $3, $4)
          `, [car.id, variant.name, variant.price, variant.features]);
        }
      }
      
      // Insert car gallery images
      if (car.gallery && car.gallery.length > 0) {
        for (const image of car.gallery) {
          await db.query(`
            INSERT INTO car_gallery (car_id, image_url)
            VALUES ($1, $2)
          `, [car.id, image]);
        }
      }
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

importData();
