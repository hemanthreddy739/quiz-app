const express = require('express');
const cors = require('cors');
const config = require('./config');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// API Routes
app.use(`/api/${config.API_VERSION}`, quizRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Quiz Application API',
    version: config.API_VERSION,
    endpoints: {
      quizzes: '/api/v1/quizzes',
      questions: '/api/v1/questions/:questionId',
      submit: '/api/v1/quizzes/:quizId/submit',
      results: '/api/v1/results/:sessionId',
      health: '/api/v1/health',
      leaderboard: '/api/v1/leaderboard'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: config.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
