// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Make sure cors is imported
const db = require('./src/database');

// Define allowed origins
// IMPORTANT: Replace 'https://aahdc-lottery-platform.vercel.app' with your actual frontend domain on Vercel
const allowedOrigins = [
  'http://localhost:3000', // For local development of frontend
  'https://aahdc-lottery-platform.vercel.app', // Your deployed frontend domain
  'https://aahdc-lottery.vercel.app' // If your backend might also host the frontend (unlikely for this setup)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our allowed list.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

const app = express();

// Use CORS middleware with specific options
app.use(cors(corsOptions));

app.use(express.json());

// ... (rest of your server.js code) ...

module.exports = app;
