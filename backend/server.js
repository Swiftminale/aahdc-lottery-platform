// backend/server.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const db = require('./src/database');

// Import routes
const unitRoutes = require('./src/routes/unitRoutes');
const allocationRoutes = require('./src/routes/allocationRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const app = express();
// The PORT is not relevant for Vercel serverless functions

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // For parsing application/json requests

// Use routes
app.use('/api/units', unitRoutes);
app.use('/api/allocation', allocationRoutes);
app.use('/api/reports', reportRoutes);

// Database synchronization - IMPORTANT:
// In a production serverless app, you would typically run database migrations
// as a separate build step (e.g., using Sequelize CLI commands within Vercel's
// build configuration) rather than on every function invocation (cold start).
// For this demonstration, we'll keep it here. It will run on the first cold start
// and subsequent cold starts, which is acceptable for a simple demo but less efficient.
db.sequelize.sync({ force: false }) // `force: false` is crucial to prevent data loss!
  .then(() => {
    console.log('Database synced successfully with Neon PostgreSQL.');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
    // In a serverless environment, failure here might not stop the "server"
    // but will likely cause subsequent database operations to fail.
  });

// Export the app for Vercel
module.exports = app;
