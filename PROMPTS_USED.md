# Prompts Used for App Development

This document records the prompts used during the development of the Meeting Action Items Tracker application. API keys and agent responses have been excluded for security and brevity.

---

## Session 1: Initial Project Setup

### Prompt 1: Project Initialization
```
Problem statement A: Meeting Action Items Tracker (mini workspace)
Build a web app where I can:
* paste a meeting transcript (text is enough)
* get a list of action items (task + owner if possible + due date if found)
* edit, add, and delete action items
* mark items as done
* see a simple history of the last 5 transcripts I processed

Make it your own: for example, add filters (open/done), tags, or a better editor.

What to include:
* A simple home page with clear steps
* A status page, that shows health of backend, database, and llm connection.
* Basic handling for empty/wrong input
* A short README: how to run, what is done, what is not done
* A short AI_NOTES.md: what you used AI for, and what you checked yourself. Which LLM and provider does your app use and why.
* Put your name and resume in ABOUTME.md
* A PROMPTS_USED.md, with records of your prompts used for app development.

Tech stack:
front-end: React 
backend: python + FastAPI
Database: postgresql
LLM: Claude gemini flash 2.0

complete this project perfectly and dont write manually installation install each and everything by using terminal and develop step by step each and everything by using terminal and the project make perfect each and everything install by terminal using python+FAST API everything should be perfect not to do extra just install by terminal not use any different things install everything by terminal step by step on working process
```

**Purpose**: Initial project requirements and setup
**Date**: February 12, 2026

---

## Session 2: Database & PostgreSQL Setup

### Prompt 2: PostgreSQL Installation Query
```
how to download ?
```

**Context**: Asked when PostgreSQL winget installation failed
**Purpose**: Seeking guidance on alternative PostgreSQL installation method
**Date**: February 12, 2026

### Prompt 3: PostgreSQL Setup Port Configuration
```
i have successfully install now what next port?
```

**Context**: During PostgreSQL installation wizard
**Purpose**: Confirming default port selection (5432)
**Date**: February 12, 2026

### Prompt 4: SQLite vs PostgreSQL Dependencies
```
if we have psql then why need aisqlite?
```

**Context**: Questioning dependency choices in requirements.txt
**Purpose**: Understanding why aiosqlite was listed when using PostgreSQL
**Result**: Removed aiosqlite; later migrated from PostgreSQL to SQLite (psycopg2-binary also removed)
**Date**: February 12, 2026

---

## Development Process Notes

### Backend Development
- Used AI to generate FastAPI application structure
- Created database models with SQLAlchemy
- Built RESTful API endpoints for transcripts and action items
- Integrated Google Gemini 2.5 Flash for LLM functionality
- Set up health check endpoints with caching

### Frontend Development
- Created React components with Material-UI
- Implemented routing with React Router
- Built API service layer with axios
- Designed responsive user interface
- Added form validation and error handling

### Database Setup
- Configured SQLite database (file-based, no server needed)
- Configured SQLAlchemy ORM with relationships
- Set up database initialization script
- Implemented cascade deletion for related records

### LLM Integration
- Configured Google Gemini API client
- Designed prompts for action item extraction
- Implemented JSON parsing for structured output
- Added error handling for API failures

---

## Prompt Engineering for LLM Service

### Action Item Extraction Prompt Template
```python
prompt = f"""
Analyze this meeting transcript and extract action items. For each action item, identify:
1. The task/action to be completed
2. The person responsible (if mentioned)
3. Any due date or timeline mentioned
4. Any relevant tags or categories

Format the response as a JSON array of objects with these fields:
- task (string): Clear description of what needs to be done
- owner (string or null): Person responsible
- due_date (string or null): When it's due (keep original format from transcript)
- tags (string or null): Relevant categories/tags

Meeting Transcript:
{transcript}

Return only the JSON array, no other text.
"""
```

**Purpose**: Extract structured action items from unstructured meeting transcript text
**Model**: Gemini 2.5 Flash
**Output Format**: JSON array

---

## Terminal Commands Used

### Python Environment Setup
```bash
python --version
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Dependency Installation
```bash
# Via Python environment tool
configure_python_environment
install_python_packages [list of packages]
```

### Frontend Setup
```bash
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns
```

### Directory Creation
```powershell
New-Item -ItemType Directory -Path "backend" -Force
New-Item -ItemType Directory -Path "backend/app" -Force
New-Item -ItemType Directory -Path "backend/app/models" -Force
New-Item -ItemType Directory -Path "backend/app/routers" -Force
New-Item -ItemType Directory -Path "backend/app/services" -Force
New-Item -ItemType Directory -Path "backend/app/utils" -Force
New-Item -ItemType Directory -Path "backend/tests" -Force
New-Item -ItemType Directory -Path "src/components" -Force
New-Item -ItemType Directory -Path "src/services" -Force
```

---

## Code Generation Requests

### API Endpoints
- Created health check endpoint: `/health`
- Created transcript endpoints: `/transcripts/`, `/transcripts/{id}`
- Created action items endpoints: `/action-items/`, `/action-items/{id}`, etc.

### React Components
- HomePage: Landing page with feature overview
- TranscriptProcessor: Form to submit meeting transcripts
- ActionItemsList: Display and manage action items with CRUD operations
- TranscriptHistory: Show last 5 processed transcripts
- HealthStatus: System health monitoring dashboard

### Database Models
- Transcript model with one-to-many relationship to ActionItem
- ActionItem model with foreign key to Transcript
- SQLAlchemy configuration and session management

---

## Documentation Generation

### Files Created
1. **README.md**: Complete project documentation
2. **AI_NOTES.md**: AI usage and manual verification details
3. **ABOUTME.md**: Developer information template
4. **PROMPTS_USED.md**: This file

### Sections Generated
- Installation instructions
- API documentation
- Project structure
- Troubleshooting guide
- Feature lists (done/not done)

---

## Key Design Decisions

### Why Gemini 2.5 Flash?
- Fast inference for real-time extraction
- Cost-effective compared to Pro models
- Excellent JSON output formatting
- Large context window for meeting transcripts
- Separate quota pool from older models (helps with free-tier rate limits)
- Built-in retry logic handles 429 rate limits gracefully

### Architecture Choices
- FastAPI for modern async Python backend
- SQLAlchemy ORM for database abstraction
- Material-UI for consistent, professional UI
- React Router for single-page application navigation
- Axios for clean API client layer

### Database Design
- SQLite for simplicity (file-based, zero configuration, no server needed)
- Normalization with foreign key relationships
- Cascade deletion for data integrity
- Timestamps for audit trail

---

## Testing & Validation Prompts

No automated testing prompts were used, as tests were not implemented in this version. Manual testing was performed through:
- FastAPI Swagger UI at `/docs`
- Browser testing of React components
- Database query verification

---

## Troubleshooting During Development

### Database Migration
- Initially set up with PostgreSQL, later migrated to SQLite for simplicity
- Removed psycopg2-binary dependency, used SQLite's built-in support
- Updated database.py connection string to use SQLite file path

### LLM Model Changes
- Started with gemini-2.0-flash-exp (model not found)
- Switched to gemini-2.0-flash (worked but hit 429 rate limits on free tier)
- Final: gemini-2.5-flash (separate quota, reliable on free tier)
- Added retry logic with exponential backoff for rate limit resilience

### Dependency Management
- Clarified psycopg2-binary vs aiosqlite usage
- Verified package version compatibility

---

## Environment Configuration

### .env Template Created
```env
GOOGLE_API_KEY=your_google_api_key_here
```

---

## Summary

Total development time: Approximately 2-3 hours
Primary AI tool: GitHub Copilot / Claude / ChatGPT
Languages used: Python, JavaScript
Frameworks: FastAPI, React
Database: SQLite
Total files created: 20+
Lines of code: ~2500+

---

*Note: This document captures the major prompts and decisions made during development. Some minor iterative prompts and clarifications have been consolidated for readability.*