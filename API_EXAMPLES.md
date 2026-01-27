# Quiz Application - API Examples

This document provides practical examples for using the Quiz Application API.

## Base URL
```
http://localhost:3000/api/v1
```

## Examples Using cURL

### 1. Get All Quizzes
```bash
curl -X GET http://localhost:3000/api/v1/quizzes
```

### 2. Get Specific Quiz
```bash
curl -X GET http://localhost:3000/api/v1/quizzes/1
```

### 3. Get Quiz Summary (without correct answers)
```bash
curl -X GET http://localhost:3000/api/v1/quizzes/1/summary
```

### 4. Get All Questions for a Quiz
```bash
curl -X GET http://localhost:3000/api/v1/quizzes/1/questions
```

### 5. Get Specific Question
```bash
curl -X GET http://localhost:3000/api/v1/questions/q1
```

### 6. Submit Quiz Responses
```bash
curl -X POST http://localhost:3000/api/v1/quizzes/1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "questionId": "q1",
        "selectedOptionId": "opt2"
      },
      {
        "questionId": "q2",
        "selectedOptionId": "opt2"
      },
      {
        "questionId": "q3",
        "selectedOptionId": "opt2"
      }
    ]
  }'
```

### 7. Get Quiz Result
```bash
curl -X GET http://localhost:3000/api/v1/results/{sessionId}
```

### 8. Get All Quiz Results
```bash
curl -X GET http://localhost:3000/api/v1/results
```

### 9. Health Check
```bash
curl -X GET http://localhost:3000/api/v1/health
```

## Examples Using JavaScript/Node.js

### Fetch All Quizzes
```javascript
async function getAllQuizzes() {
  const response = await fetch('http://localhost:3000/api/v1/quizzes');
  const data = await response.json();
  console.log(data);
}
```

### Get Quiz Summary
```javascript
async function getQuizSummary(quizId) {
  const response = await fetch(
    `http://localhost:3000/api/v1/quizzes/${quizId}/summary`
  );
  const data = await response.json();
  console.log(data);
}
```

### Submit Quiz Response
```javascript
async function submitQuiz(quizId, responses) {
  const response = await fetch(
    `http://localhost:3000/api/v1/quizzes/${quizId}/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responses })
    }
  );
  const data = await response.json();
  console.log(data);
  return data.data.sessionId;
}

// Usage
const responses = [
  { questionId: 'q1', selectedOptionId: 'opt2' },
  { questionId: 'q2', selectedOptionId: 'opt2' },
  { questionId: 'q3', selectedOptionId: 'opt2' }
];

submitQuiz('1', responses);
```

### Get Quiz Result
```javascript
async function getQuizResult(sessionId) {
  const response = await fetch(
    `http://localhost:3000/api/v1/results/${sessionId}`
  );
  const data = await response.json();
  console.log(data);
}
```

## Examples Using Axios

### Install Axios
```bash
npm install axios
```

### Usage Examples
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
});

// Get all quizzes
async function getAllQuizzes() {
  const response = await api.get('/quizzes');
  return response.data;
}

// Get quiz summary
async function getQuizSummary(quizId) {
  const response = await api.get(`/quizzes/${quizId}/summary`);
  return response.data;
}

// Submit quiz
async function submitQuiz(quizId, responses) {
  const response = await api.post(`/quizzes/${quizId}/submit`, {
    responses
  });
  return response.data;
}

// Get result
async function getResult(sessionId) {
  const response = await api.get(`/results/${sessionId}`);
  return response.data;
}
```

## Response Examples

### Successful Quiz Submission Response
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "quizId": "1",
    "totalQuestions": 3,
    "answeredQuestions": 3,
    "correctAnswers": 3,
    "score": 100,
    "isPassed": true,
    "timestamp": "2026-01-27T06:59:02.589Z",
    "detailedResults": [
      {
        "questionId": "q1",
        "selectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "question": "What is the output of typeof NaN?"
      },
      {
        "questionId": "q2",
        "selectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "question": "Which method is used to add elements to the end of an array?"
      },
      {
        "questionId": "q3",
        "selectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "question": "What does async/await improve over callbacks?"
      }
    ]
  }
}
```

### Failed Quiz Response (Partial Score)
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "sessionId": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "quizId": "1",
    "totalQuestions": 3,
    "answeredQuestions": 3,
    "correctAnswers": 2,
    "score": 67,
    "isPassed": false,
    "timestamp": "2026-01-27T06:59:02.589Z",
    "detailedResults": [
      {
        "questionId": "q1",
        "selectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "question": "What is the output of typeof NaN?"
      },
      {
        "questionId": "q2",
        "selectedOptionId": "opt1",
        "correctOptionId": "opt2",
        "isCorrect": false,
        "question": "Which method is used to add elements to the end of an array?"
      },
      {
        "questionId": "q3",
        "selectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "question": "What does async/await improve over callbacks?"
      }
    ]
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Quiz with ID 999 not found"
}
```

## Using Thunder Client or Postman

### Create a Quiz Submission Request

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/quizzes/1/submit`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "responses": [
    {
      "questionId": "q1",
      "selectedOptionId": "opt2"
    },
    {
      "questionId": "q2",
      "selectedOptionId": "opt2"
    },
    {
      "questionId": "q3",
      "selectedOptionId": "opt2"
    }
  ]
}
```

## Common Error Scenarios

### 1. Quiz Not Found (404)
**Request:** `GET /quizzes/999`  
**Response:**
```json
{
  "success": false,
  "message": "Quiz with ID 999 not found"
}
```

### 2. Invalid Responses (400)
**Request:** `POST /quizzes/1/submit` with empty responses  
**Response:**
```json
{
  "success": false,
  "message": "Responses are required"
}
```

### 3. Question Not in Quiz (400)
**Request:** `POST /quizzes/1/submit` with question from quiz 2  
**Response:**
```json
{
  "success": false,
  "message": "Question q4 does not belong to quiz 1"
}
```

## Tips for Testing

1. **Test Successful Submission:** Submit all correct answers to get a 100% score
2. **Test Partial Score:** Submit some wrong answers to test score calculation
3. **Test Pass/Fail:** Check quiz passing score thresholds
4. **Test Session ID:** Each submission generates a unique session ID
5. **Test Retrieval:** Use session ID to retrieve results later
