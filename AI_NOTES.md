# AI Usage Notes

## What I Used AI For

### 1. Code Generation (90%)
- **Backend Structure**: Used AI to generate the complete FastAPI backend architecture including:
  - Database models (SQLAlchemy ORM)
  - API route handlers for transcripts and action items
  - Pydantic schemas for request/response validation
  - Database configuration and session management
  - Health check endpoints

- **LLM Integration**: AI helped structure the Google Gemini Flash 2.0 integration:
  - Service class architecture
  - Prompt engineering for action item extraction
  - JSON parsing and error handling
  - Response formatting

- **Frontend Components**: Generated all React components:
  - HomePage with navigation and feature overview
  - TranscriptProcessor for text input and submission
  - ActionItemsList with CRUD operations and filtering
  - TranscriptHistory for viewing past transcripts
  - HealthStatus for system monitoring
  - Material-UI implementation and styling

- **API Client**: Created axios-based API service layer for HTTP requests

### 2. Configuration Files
- `requirements.txt` with appropriate Python package versions
- `.env.example` template with necessary environment variables
- Database setup script (`setup_db.py`)
- Server runner script (`run.py`)

### 3. Documentation
- README.md structure and content
- API endpoint documentation
- Setup instructions
- Troubleshooting guides

## What I Checked/Modified Myself

### 1. Dependency Versions ✓
- Verified FastAPI, SQLAlchemy, and other package versions are compatible
- Ensured React and Material-UI versions match
- Checked google-generativeai library version supports Gemini 2.0 Flash

### 2. Database Configuration ✓
- Reviewed SQLite connection configuration
- Verified SQLAlchemy engine configuration with check_same_thread=False
- Checked table relationships and foreign keys
- Ensured proper cascade deletion for transcript->action items relationship

### 3. API Design ✓
- Validated RESTful endpoint naming conventions
- Checked HTTP methods (GET, POST, PUT, PATCH, DELETE) are appropriate
- Reviewed request/response schemas
- Ensured proper error handling and status codes

### 4. CORS Configuration ✓
- Verified CORS middleware allows React dev server (localhost:3000)
- Checked allowed methods and headers

### 5. LLM Prompt Engineering ✓
- Reviewed the prompt structure for action item extraction
- Verified JSON format expectations
- Added fallback error handling for LLM responses
- Ensured prompt is clear and specific

### 6. Frontend Logic ✓
- Checked React Router navigation flow
- Verified state management in components
- Reviewed error handling and user feedback (alerts, snackbars)
- Ensured proper form validation

### 7. Environment Variables ✓
- Confirmed all sensitive data uses environment variables
- Checked `.env.example` has all required keys
- Verified dotenv loading in Python backend

### 8. File Structure ✓
- Organized backend with proper separation of concerns (models, routers, services)
- Structured React components with clear responsibilities
- Ensured logical folder hierarchy

## LLM Provider and Model

### Provider: **Google (Vertex AI / Google AI)**

### Model: **Gemini 2.0 Flash Experimental**

### Why This Choice?

1. **Speed**: Gemini Flash 2.0 is optimized for fast inference, making it ideal for real-time action item extraction from meeting transcripts

2. **Cost-Effective**: Flash variant is more economical than Pro models while maintaining good quality for structured text extraction tasks

3. **JSON Support**: Excellent at generating structured JSON output, which is critical for extracting action items with specific fields (task, owner, due_date, tags)

4. **Context Window**: Large enough to handle full meeting transcripts (typical meetings are 1000-5000 tokens)

5. **Availability**: As of 2026, Gemini 2.0 Flash represents Google's latest generation with improved multimodal capabilities and reasoning

6. **API Access**: Simple integration via `google-generativeai` Python library with straightforward API key authentication

### Alternative Considerations:
- **OpenAI GPT-4**: More expensive, but could provide better accuracy
- **Claude (Anthropic)**: Strong at structured tasks, but requires different SDK
- **Gemini Pro**: More capable but slower and more expensive for this use case

The Flash variant strikes the best balance between speed, cost, and quality for this specific application of extracting structured data from text.

## Testing Approach

### Manual Testing
- Tested endpoints using FastAPI's auto-generated Swagger UI (`/docs`)
- Verified frontend components render correctly
- Checked database operations create, read, update, delete properly
- Tested error scenarios (empty inputs, missing API keys, database disconnection)

### What Needs Automated Testing
- Unit tests for API endpoints
- Integration tests for database operations
- Frontend component tests (Jest/React Testing Library)
- End-to-end tests for critical user flows
- LLM response parsing edge cases

## Security Considerations Reviewed

- Environment variables for sensitive data (API keys, database credentials)
- CORS configuration limits access to frontend origin
- SQL injection prevention via SQLAlchemy ORM
- No authentication implemented (noted in "What's Not Done" section)

## Performance Considerations

- Database indexes on frequently queried fields (id, transcript_id)
- Lazy loading of relationships in SQLAlchemy
- Frontend pagination not implemented (noted for future)
- LLM calls are async-capable but not fully optimized

## Known Limitations

1. No retry logic for LLM API failures
2. Limited error messages for users
3. No input sanitization beyond basic validation
4. No rate limiting on API endpoints
5. Session management not implemented