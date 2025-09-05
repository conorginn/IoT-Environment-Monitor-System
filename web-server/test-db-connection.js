const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing database connection with these parameters:');
console.log('Host:', process.env.DB_HOST);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
    
    // Test if the sensor_data table exists
    pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sensor_data')", (err, res) => {
      if (err) {
        console.error('Error checking table:', err);
      } else {
        console.log('sensor_data table exists:', res.rows[0].exists);
      }
      pool.end();
    });
  }
});
