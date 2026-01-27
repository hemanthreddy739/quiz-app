const { v4: uuidv4 } = require('uuid');

class QuizService {
  constructor(quizData) {
    this.quizzes = quizData.quizzes;
    this.questions = quizData.questions;
    this.userResponses = {};
  }

  // Get all quizzes
  getAllQuizzes() {
    return this.quizzes;
  }

  // Get quiz by ID
  getQuizById(quizId) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }
    return quiz;
  }

  // Get questions for a specific quiz
  getQuestionsByQuizId(quizId) {
    // Verify quiz exists
    this.getQuizById(quizId);
    
    return this.questions.filter(q => q.quizId === quizId);
  }

  // Get question by ID
  getQuestionById(questionId) {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }
    return question;
  }

  // Submit quiz response
  submitQuizResponse(quizId, responses) {
    // Verify quiz exists
    this.getQuizById(quizId);

    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error('Invalid responses. Must provide an array of responses.');
    }

    const sessionId = uuidv4();
    const quizQuestions = this.getQuestionsByQuizId(quizId);
    
    let correctCount = 0;
    const detailedResults = [];

    responses.forEach(response => {
      const question = this.getQuestionById(response.questionId);
      
      if (question.quizId !== quizId) {
        throw new Error(`Question ${response.questionId} does not belong to quiz ${quizId}`);
      }

      const isCorrect = response.selectedOptionId === question.correctOptionId;
      if (isCorrect) {
        correctCount++;
      }

      detailedResults.push({
        questionId: response.questionId,
        selectedOptionId: response.selectedOptionId,
        correctOptionId: question.correctOptionId,
        isCorrect: isCorrect,
        question: question.question
      });
    });

    const score = Math.round((correctCount / quizQuestions.length) * 100);
    const quiz = this.getQuizById(quizId);
    const isPassed = score >= quiz.passingScore;

    const result = {
      sessionId,
      quizId,
      totalQuestions: quizQuestions.length,
      answeredQuestions: responses.length,
      correctAnswers: correctCount,
      score,
      isPassed,
      timestamp: new Date(),
      detailedResults
    };

    this.userResponses[sessionId] = result;
    return result;
  }

  // Get quiz result
  getQuizResult(sessionId) {
    const result = this.userResponses[sessionId];
    if (!result) {
      throw new Error(`No result found for session ${sessionId}`);
    }
    return result;
  }

  // Get all quiz results
  getAllQuizResults() {
    return Object.values(this.userResponses);
  }

  // Get summary of a question (without correct answer for quiz mode)
  getQuestionSummary(questionId) {
    const question = this.getQuestionById(questionId);
    return {
      id: question.id,
      question: question.question,
      options: question.options.map(opt => ({
        id: opt.id,
        text: opt.text
      })),
      difficulty: question.difficulty
    };
  }

  // Get quiz summary (questions without answers)
  getQuizSummary(quizId) {
    const quiz = this.getQuizById(quizId);
    const questions = this.getQuestionsByQuizId(quizId);
    
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      totalQuestions: quiz.totalQuestions,
      passingScore: quiz.passingScore,
      questions: questions.map(q => this.getQuestionSummary(q.id))
    };
  }
}

module.exports = QuizService;
