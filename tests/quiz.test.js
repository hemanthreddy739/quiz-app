const request = require('supertest');
const app = require('../src/app');

describe('Quiz Application API Tests', () => {
  
  // Test Suite: Quizzes Endpoints
  describe('GET /api/v1/quizzes', () => {
    it('should retrieve all quizzes successfully', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
    });

    it('should have correct structure for quiz objects', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes')
        .expect(200);

      const quiz = response.body.data[0];
      expect(quiz).toHaveProperty('id');
      expect(quiz).toHaveProperty('title');
      expect(quiz).toHaveProperty('description');
      expect(quiz).toHaveProperty('category');
      expect(quiz).toHaveProperty('totalQuestions');
      expect(quiz).toHaveProperty('passingScore');
    });
  });

  describe('GET /api/v1/quizzes/:quizId', () => {
    it('should retrieve a specific quiz by ID', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
      expect(response.body.data.title).toBe('JavaScript Basics');
    });

    it('should return 404 for non-existent quiz', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/quizzes/:quizId/summary', () => {
    it('should retrieve quiz summary with questions without answers', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/1/summary')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('questions');
      expect(response.body.data.questions).toBeInstanceOf(Array);
      
      // Verify no correct answers are included
      response.body.data.questions.forEach(question => {
        expect(question).not.toHaveProperty('correctOptionId');
      });
    });

    it('should have questions with proper structure in summary', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/1/summary')
        .expect(200);

      const question = response.body.data.questions[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question.options).toBeInstanceOf(Array);
    });

    it('should return 404 for non-existent quiz summary', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/999/summary')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // Test Suite: Questions Endpoints
  describe('GET /api/v1/quizzes/:quizId/questions', () => {
    it('should retrieve all questions for a quiz', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/1/questions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.count).toBe(3); // Quiz 1 has 3 questions
    });

    it('should return 404 for non-existent quiz', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/999/questions')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should have questions with correct structure', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/1/questions')
        .expect(200);

      const question = response.body.data[0];
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('quizId');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('correctOptionId');
      expect(question).toHaveProperty('difficulty');
    });
  });

  describe('GET /api/v1/questions/:questionId', () => {
    it('should retrieve a specific question by ID', async () => {
      const response = await request(app)
        .get('/api/v1/questions/q1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('q1');
      expect(response.body.data.question).toBe('What is the output of typeof NaN?');
    });

    it('should return 404 for non-existent question', async () => {
      const response = await request(app)
        .get('/api/v1/questions/invalid')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should include correct answer option in question', async () => {
      const response = await request(app)
        .get('/api/v1/questions/q1')
        .expect(200);

      expect(response.body.data.correctOptionId).toBe('opt2');
    });
  });

  // Test Suite: Quiz Submission
  describe('POST /api/v1/quizzes/:quizId/submit', () => {
    it('should submit quiz with correct answers and return result', async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data.quizId).toBe('1');
      expect(response.body.data.totalQuestions).toBe(3);
      expect(response.body.data.score).toBe(100);
      expect(response.body.data.isPassed).toBe(true);
    });

    it('should calculate correct score with partial answers', async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt1' }, // Wrong answer
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses })
        .expect(200);

      expect(response.body.data.correctAnswers).toBe(2);
      expect(response.body.data.score).toBe(67); // 2/3 = ~66.67%, rounded to 67%
      expect(response.body.data.isPassed).toBe(false); // Passing score is 70
    });

    it('should calculate correct score with all wrong answers', async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt1' },
        { questionId: 'q2', selectedOptionId: 'opt1' },
        { questionId: 'q3', selectedOptionId: 'opt1' }
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses })
        .expect(200);

      expect(response.body.data.correctAnswers).toBe(0);
      expect(response.body.data.score).toBe(0);
      expect(response.body.data.isPassed).toBe(false);
    });

    it('should return 400 if responses are missing', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if responses array is empty', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses: [] })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error if question does not belong to quiz', async () => {
      const responses = [
        { questionId: 'q4', selectedOptionId: 'opt1' } // q4 belongs to quiz 2
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should include detailed results in response', async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' }
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses })
        .expect(200);

      expect(response.body.data.detailedResults).toBeInstanceOf(Array);
      expect(response.body.data.detailedResults[0]).toHaveProperty('questionId');
      expect(response.body.data.detailedResults[0]).toHaveProperty('selectedOptionId');
      expect(response.body.data.detailedResults[0]).toHaveProperty('correctOptionId');
      expect(response.body.data.detailedResults[0]).toHaveProperty('isCorrect');
    });

    it('should generate unique session IDs for different submissions', async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const res1 = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses });

      const res2 = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses });

      expect(res1.body.data.sessionId).not.toBe(res2.body.data.sessionId);
    });
  });

  // Test Suite: Results Endpoints
  describe('GET /api/v1/results/:sessionId', () => {
    let sessionId;

    beforeAll(async () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .send({ responses });

      sessionId = response.body.data.sessionId;
    });

    it('should retrieve result by session ID', async () => {
      const response = await request(app)
        .get(`/api/v1/results/${sessionId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sessionId).toBe(sessionId);
      expect(response.body.data).toHaveProperty('quizId');
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('isPassed');
    });

    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/v1/results/invalid-session-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/results', () => {
    it('should retrieve all quiz results', async () => {
      const response = await request(app)
        .get('/api/v1/results')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('count');
    });
  });

  // Test Suite: Health Check
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  // Test Suite: Root Endpoint
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  // Test Suite: Error Handling
  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Endpoint not found');
    });

    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/v1/quizzes/1/submit')
        .set('Content-Type', 'application/json')
        .send('{ invalid json');

      expect(response.status).toBe(500);
    });
  });

  // Test Suite: Response Format
  describe('Response Format Standards', () => {
    it('should return consistent response format for success', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    it('should return consistent response format for errors', async () => {
      const response = await request(app)
        .get('/api/v1/quizzes/invalid')
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });
  });
});
