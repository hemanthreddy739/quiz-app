const QuizService = require('../src/services/quizService');
const quizData = require('../src/config/quizData.json');

describe('QuizService', () => {
  let service;

  beforeEach(() => {
    service = new QuizService(quizData);
  });

  // Test Suite: Get Quizzes
  describe('getAllQuizzes', () => {
    it('should return all quizzes', () => {
      const quizzes = service.getAllQuizzes();
      expect(quizzes).toBeInstanceOf(Array);
      expect(quizzes.length).toBeGreaterThan(0);
    });

    it('should have correct quiz properties', () => {
      const quizzes = service.getAllQuizzes();
      quizzes.forEach(quiz => {
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('title');
        expect(quiz).toHaveProperty('description');
        expect(quiz).toHaveProperty('category');
        expect(quiz).toHaveProperty('totalQuestions');
        expect(quiz).toHaveProperty('passingScore');
      });
    });
  });

  describe('getQuizById', () => {
    it('should return quiz by valid ID', () => {
      const quiz = service.getQuizById('1');
      expect(quiz.id).toBe('1');
      expect(quiz.title).toBe('JavaScript Basics');
    });

    it('should throw error for invalid quiz ID', () => {
      expect(() => service.getQuizById('invalid')).toThrow();
    });

    it('should throw error message containing quiz ID', () => {
      try {
        service.getQuizById('invalid-id');
      } catch (error) {
        expect(error.message).toContain('invalid-id');
      }
    });
  });

  // Test Suite: Get Questions
  describe('getQuestionsByQuizId', () => {
    it('should return questions for valid quiz', () => {
      const questions = service.getQuestionsByQuizId('1');
      expect(questions).toBeInstanceOf(Array);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should return questions belonging to specific quiz', () => {
      const questions = service.getQuestionsByQuizId('1');
      questions.forEach(question => {
        expect(question.quizId).toBe('1');
      });
    });

    it('should throw error for invalid quiz ID', () => {
      expect(() => service.getQuestionsByQuizId('invalid')).toThrow();
    });

    it('should return correct number of questions for quiz', () => {
      const questions = service.getQuestionsByQuizId('1');
      expect(questions.length).toBe(3);
    });
  });

  describe('getQuestionById', () => {
    it('should return question by valid ID', () => {
      const question = service.getQuestionById('q1');
      expect(question.id).toBe('q1');
    });

    it('should have correct question structure', () => {
      const question = service.getQuestionById('q1');
      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('quizId');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('correctOptionId');
      expect(question).toHaveProperty('difficulty');
    });

    it('should throw error for invalid question ID', () => {
      expect(() => service.getQuestionById('invalid')).toThrow();
    });

    it('should have options array with text and id', () => {
      const question = service.getQuestionById('q1');
      question.options.forEach(option => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('text');
      });
    });
  });

  // Test Suite: Quiz Submission
  describe('submitQuizResponse', () => {
    it('should return result with all required properties', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result = service.submitQuizResponse('1', responses);

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('quizId');
      expect(result).toHaveProperty('totalQuestions');
      expect(result).toHaveProperty('answeredQuestions');
      expect(result).toHaveProperty('correctAnswers');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('isPassed');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('detailedResults');
    });

    it('should calculate score correctly for all correct answers', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result = service.submitQuizResponse('1', responses);

      expect(result.correctAnswers).toBe(3);
      expect(result.score).toBe(100);
    });

    it('should calculate score correctly for partial answers', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt1' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result = service.submitQuizResponse('1', responses);

      expect(result.correctAnswers).toBe(2);
      expect(result.score).toBe(67); // 2/3 = 66.67, rounded to 67
    });

    it('should calculate score correctly for all wrong answers', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt1' },
        { questionId: 'q2', selectedOptionId: 'opt1' },
        { questionId: 'q3', selectedOptionId: 'opt1' }
      ];

      const result = service.submitQuizResponse('1', responses);

      expect(result.correctAnswers).toBe(0);
      expect(result.score).toBe(0);
    });

    it('should determine pass/fail based on quiz passing score', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result = service.submitQuizResponse('1', responses);

      // Quiz 1 has passingScore of 70
      expect(result.isPassed).toBe(true);
    });

    it('should fail quiz when score is below passing score', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt1' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt1' }
      ];

      const result = service.submitQuizResponse('1', responses);

      expect(result.isPassed).toBe(false);
    });

    it('should throw error for empty responses array', () => {
      expect(() => service.submitQuizResponse('1', [])).toThrow();
    });

    it('should throw error for invalid responses format', () => {
      expect(() => service.submitQuizResponse('1', null)).toThrow();
      expect(() => service.submitQuizResponse('1', 'invalid')).toThrow();
    });

    it('should throw error for question not in quiz', () => {
      const responses = [
        { questionId: 'q4', selectedOptionId: 'opt1' } // q4 belongs to quiz 2
      ];

      expect(() => service.submitQuizResponse('1', responses)).toThrow();
    });

    it('should throw error for invalid quiz ID', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' }
      ];

      expect(() => service.submitQuizResponse('invalid', responses)).toThrow();
    });

    it('should store result in userResponses', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result = service.submitQuizResponse('1', responses);
      const storedResult = service.userResponses[result.sessionId];

      expect(storedResult).toEqual(result);
    });

    it('should generate unique session IDs', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const result1 = service.submitQuizResponse('1', responses);
      const result2 = service.submitQuizResponse('1', responses);

      expect(result1.sessionId).not.toBe(result2.sessionId);
    });
  });

  // Test Suite: Get Results
  describe('getQuizResult', () => {
    it('should retrieve result by session ID', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      const submitResult = service.submitQuizResponse('1', responses);
      const retrievedResult = service.getQuizResult(submitResult.sessionId);

      expect(retrievedResult).toEqual(submitResult);
    });

    it('should throw error for invalid session ID', () => {
      expect(() => service.getQuizResult('invalid-session')).toThrow();
    });
  });

  describe('getAllQuizResults', () => {
    it('should return array of all results', () => {
      const responses = [
        { questionId: 'q1', selectedOptionId: 'opt2' },
        { questionId: 'q2', selectedOptionId: 'opt2' },
        { questionId: 'q3', selectedOptionId: 'opt2' }
      ];

      service.submitQuizResponse('1', responses);
      const allResults = service.getAllQuizResults();

      expect(allResults).toBeInstanceOf(Array);
    });
  });

  // Test Suite: Quiz Summary
  describe('getQuizSummary', () => {
    it('should return quiz summary', () => {
      const summary = service.getQuizSummary('1');

      expect(summary).toHaveProperty('id');
      expect(summary).toHaveProperty('title');
      expect(summary).toHaveProperty('description');
      expect(summary).toHaveProperty('questions');
    });

    it('should not include correct answers in summary', () => {
      const summary = service.getQuizSummary('1');

      summary.questions.forEach(question => {
        expect(question).not.toHaveProperty('correctOptionId');
      });
    });

    it('should include all questions for quiz in summary', () => {
      const summary = service.getQuizSummary('1');

      expect(summary.questions.length).toBe(3);
    });
  });

  // Test Suite: Question Summary
  describe('getQuestionSummary', () => {
    it('should return question summary without correct answer', () => {
      const summary = service.getQuestionSummary('q1');

      expect(summary).toHaveProperty('id');
      expect(summary).toHaveProperty('question');
      expect(summary).toHaveProperty('options');
      expect(summary).toHaveProperty('difficulty');
      expect(summary).not.toHaveProperty('correctOptionId');
    });

    it('should throw error for invalid question ID', () => {
      expect(() => service.getQuestionSummary('invalid')).toThrow();
    });
  });
});
