require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const sessionRoutes = require('./routes/session');
const queryRoutes = require('./routes/query');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * CORS Configuration
 * Make sure CLIENT_URL in .env is:
 * https://curalink-livid.vercel.app
 * (NO trailing slash)
 */
const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from frontend and tools like Postman
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date(),
    server: 'CuraLink API'
  });
});

// Routes
app.use('/api/session', sessionRoutes);
app.use('/api/query', queryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Allowed frontend: ${allowedOrigin}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);

    // Start server even if DB fails
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB)`);
      console.log(`Allowed frontend: ${allowedOrigin}`);
    });
  });
