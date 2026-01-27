# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:3000` with auto-reload on file changes.

### Production Mode
```bash
npm start
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch
```

**Expected Output:**
```
Test Suites: 2 passed, 2 total
Tests:       63 passed, 63 total
```

## Quick API Test (using cURL)

### 1. Get all quizzes
```bash
curl http://localhost:3000/api/v1/quizzes
```

### 2. Get quiz summary (without answers)
```bash
curl http://localhost:3000/api/v1/quizzes/1/summary
```

### 3. Submit a quiz (with correct answers)
```bash
curl -X POST http://localhost:3000/api/v1/quizzes/1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"questionId": "q1", "selectedOptionId": "opt2"},
      {"questionId": "q2", "selectedOptionId": "opt2"},
      {"questionId": "q3", "selectedOptionId": "opt2"}
    ]
  }'
```

Expected response with `"score": 100` and `"isPassed": true`

### 4. Get quiz result (replace SESSION_ID with the sessionId from step 3)
```bash
curl http://localhost:3000/api/v1/results/SESSION_ID
```

## Project Structure

```
quiz-app/
├── src/
│   ├── config/quizData.json    ← Quiz questions database
│   ├── services/quizService.js ← Business logic
│   ├── routes/quizRoutes.js    ← API endpoints
│   ├── app.js                  ← Express app
│   └── index.js                ← Server entry
├── tests/
│   ├── quiz.test.js            ← API tests
│   └── quizService.test.js     ← Service tests
└── README.md                   ← Full documentation
```

## Key Files to Know

- **`src/config/quizData.json`** - Modify this to add/edit quizzes and questions
- **`src/routes/quizRoutes.js`** - Add new API endpoints here
- **`src/services/quizService.js`** - Add business logic here
- **`tests/`** - Add new tests here

## API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/quizzes` | Get all quizzes |
| GET | `/api/v1/quizzes/:id` | Get quiz by ID |
| GET | `/api/v1/quizzes/:id/summary` | Get quiz with questions (no answers) |
| GET | `/api/v1/quizzes/:id/questions` | Get all questions for quiz |
| GET | `/api/v1/questions/:id` | Get specific question |
| POST | `/api/v1/quizzes/:id/submit` | Submit quiz answers |
| GET | `/api/v1/results/:sessionId` | Get quiz result |
| GET | `/api/v1/results` | Get all results |
| GET | `/api/v1/health` | Health check |

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
echo "PORT=3001" > .env
npm start
```

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Need More Details?
- See **README.md** for complete documentation
- See **API_EXAMPLES.md** for detailed API usage examples
- See **PROJECT_SUMMARY.md** for architecture overview

## Sample Quiz Details

**Quiz 1: JavaScript Basics** (3 questions, 70% to pass)
- q1: typeof NaN
- q2: Array push method
- q3: async/await benefits

**Quiz 2: React Advanced** (3 questions, 75% to pass)
- q4: useCallback hook
- q5: React Context purpose
- q6: Data fetching hook

---

**You're all set! Start the server with `npm run dev` and test the APIs.** 🚀
