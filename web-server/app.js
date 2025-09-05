const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./utils/database');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.send('IoT Environment Monitor Server is running!');
});

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    console.log('Fetching data with limit:', limit);
    
    const result = await database.query(
      'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    
    console.log('Query successful, found', result.rows.length, 'rows');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});

app.get('/api/data/latest', async (req, res) => {
  try {
    const result = await database.query(
      'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1'
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching latest data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
