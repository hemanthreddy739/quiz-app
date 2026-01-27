const express = require('express');
const router = express.Router();

const quizService = require('../services/quizService');
const quizData = require('../config/quizData.json');
const service = new quizService(quizData);

/**
 * GET /api/v1/quizzes
 * Get all available quizzes
 */
router.get('/quizzes', (req, res) => {
  try {
    const quizzes = service.getAllQuizzes();
    res.status(200).json({
      success: true,
      message: 'Quizzes retrieved successfully',
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/quizzes/:quizId
 * Get a specific quiz by ID
 */
router.get('/quizzes/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = service.getQuizById(quizId);
    res.status(200).json({
      success: true,
      message: 'Quiz retrieved successfully',
      data: quiz
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/quizzes/:quizId/summary
 * Get quiz summary with questions (without correct answers)
 */
router.get('/quizzes/:quizId/summary', (req, res) => {
  try {
    const { quizId } = req.params;
    const summary = service.getQuizSummary(quizId);
    res.status(200).json({
      success: true,
      message: 'Quiz summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/quizzes/:quizId/questions
 * Get all questions for a quiz
 */
router.get('/quizzes/:quizId/questions', (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = service.getQuestionsByQuizId(quizId);
    res.status(200).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
      count: questions.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/questions/:questionId
 * Get a specific question by ID
 */
router.get('/questions/:questionId', (req, res) => {
  try {
    const { questionId } = req.params;
    const question = service.getQuestionById(questionId);
    res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/v1/quizzes/:quizId/submit
 * Submit quiz responses and get results
 * Body: { responses: [{ questionId: string, selectedOptionId: string }] }
 */
router.post('/quizzes/:quizId/submit', (req, res) => {
  try {
    const { quizId } = req.params;
    const { responses } = req.body;

    if (!responses) {
      return res.status(400).json({
        success: false,
        message: 'Responses are required'
      });
    }

    const result = service.submitQuizResponse(quizId, responses);
    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/results/:sessionId
 * Get results of a submitted quiz
 */
router.get('/results/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = service.getQuizResult(sessionId);
    res.status(200).json({
      success: true,
      message: 'Result retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/results
 * Get all quiz results
 */
router.get('/results', (req, res) => {
  try {
    const results = service.getAllQuizResults();
    res.status(200).json({
      success: true,
      message: 'Results retrieved successfully',
      data: results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date()
  });
});

module.exports = router;
