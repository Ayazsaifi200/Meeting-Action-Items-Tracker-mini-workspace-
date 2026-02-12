# Meeting Action Items Tracker

A full-stack web application that extracts and manages action items from meeting transcripts using AI.

## Features

- **AI-Powered Extraction**: Uses Google Gemini 2.5 Flash to automatically identify tasks, owners, and due dates from meeting transcripts
- **Action Item Management**: Edit, add, delete, and mark items as complete
- **Filtering**: Filter by status (open/completed)
- **Tagging System**: Categorize action items with custom tags
- **History**: View last 5 processed transcripts
- **Health Monitoring**: Real-time system health status for backend, database, and LLM connections
- **Responsive UI**: Clean Material-UI based interface

## Tech Stack

### Frontend
- React 19.2.4
- Material-UI (MUI) 7.3.8
- React Router 7.13.0
- Axios 1.13.5 for API calls
- date-fns 4.1.0 for date formatting

### Backend
- Python 3.11+
- FastAPI 0.104.1
- SQLAlchemy 2.0.23 (ORM)
- Uvicorn 0.24.0 (ASGI server)
- Pydantic 2.5.0 (data validation)

### Database
- SQLite (file-based, no server needed)

### LLM
- Google Gemini 2.5 Flash via google-generativeai 0.3.2
- Built-in retry logic (3 attempts with 30s/60s backoff for rate limits)
- Health check caching (2-minute TTL using count_tokens)

## Quick Start

For a detailed step-by-step guide, see [QUICKSTART.md](QUICKSTART.md).

For Windows users, use the batch scripts:
- `start-backend.bat` — Activates venv and runs the backend server
- `start-frontend.bat` — Starts the React development server

## Prerequisites

- Python 3.11 or higher
- Node.js 16+ and npm
- Google API Key for Gemini (get from https://makersuite.google.com/app/apikey)

## Installation & Setup

### 1. Clone and Navigate
```bash
cd mini-workspace
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies (will be done automatically if you configured Python environment)
# Or manually: pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

Edit `backend/.env` with your configuration:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Important**: Add your Google API key. The database uses SQLite and requires no configuration.

### 3. Database Setup

```bash
# SQLite requires no server - the database file is created automatically
python setup_db.py
```

### 4. Start Backend Server

```bash
# From backend directory
python run.py
```

The API will be available at http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 5. Frontend Setup

Open a new terminal:

```bash
# From project root (mini-workspace)

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at http://localhost:3000

## Usage

1. **Home Page**: Overview of features and quick navigation
2. **Process Meeting**: Paste your meeting transcript text and let AI extract action items
3. **Action Items**: View, edit, add, delete, and mark items as complete. Filter by status.
4. **History**: Browse your last 5 processed transcripts
5. **Status**: Check system health (backend, database, LLM connection)

## Project Structure

```
mini-workspace/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── __init__.py      # Transcript & ActionItem models
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── action_items.py   # CRUD endpoints for action items
│   │   │   ├── health.py         # Health check endpoint
│   │   │   └── transcripts.py    # Transcript processing endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── llm_service.py    # Gemini 2.5 Flash integration
│   │   ├── __init__.py
│   │   ├── database.py           # SQLite configuration & session
│   │   ├── schemas.py            # Pydantic request/response models
│   │   └── main.py               # FastAPI app & CORS config
│   ├── venv/                     # Python virtual environment
│   ├── .env                      # API key (not in git)
│   ├── .env.example              # Environment template
│   ├── meetingtracker.db         # SQLite database (auto-created, not in git)
│   ├── requirements.txt          # Python dependencies
│   ├── setup_db.py               # Database initialization script
│   └── run.py                    # Uvicorn server launcher
├── src/
│   ├── components/
│   │   ├── HomePage.js            # Landing page with feature overview
│   │   ├── TranscriptProcessor.js # Paste & process meeting transcripts
│   │   ├── ActionItemsList.js     # View/edit/filter action items
│   │   ├── TranscriptHistory.js   # Last 5 processed transcripts
│   │   └── HealthStatus.js        # System health dashboard
│   ├── services/
│   │   └── api.js                 # Axios API client layer
│   ├── App.js                     # Router & theme setup
│   ├── App.css                    # Global styles
│   └── index.js                   # React entry point
├── public/
│   └── index.html                 # HTML template
├── .env                           # Frontend config (REACT_APP_API_URL)
├── .gitignore
├── package.json
├── README.md
├── QUICKSTART.md                  # Step-by-step startup guide
├── AI_NOTES.md                    # AI usage documentation
├── ABOUTME.md                     # Developer information
├── PROMPTS_USED.md                # Prompts used during development
├── CHECKLIST.md                   # Project requirements checklist
├── PROJECT_SUMMARY.md             # Technical summary
├── start-backend.bat              # One-click backend launcher (Windows)
└── start-frontend.bat             # One-click frontend launcher (Windows)
```

## API Endpoints

### Health
- `GET /health` - System health check

### Transcripts
- `GET /transcripts/?limit=5` - Get recent transcripts (default: 5)
- `GET /transcripts/{id}` - Get specific transcript with its action items
- `POST /transcripts/` - Create transcript and auto-extract action items via AI
- `DELETE /transcripts/{id}` - Delete transcript and all its action items (cascade)

### Action Items
- `GET /action-items/?transcript_id=&status=` - Get action items (filterable by transcript_id and status)
- `GET /action-items/{id}` - Get specific action item
- `POST /action-items/` - Create action item manually
- `PUT /action-items/{id}` - Update action item fields
- `DELETE /action-items/{id}` - Delete action item
- `PATCH /action-items/{id}/complete` - Mark as completed

## What's Done ✅

- Full-stack architecture (React + FastAPI + SQLite)
- AI-powered action item extraction using Google Gemini 2.5 Flash
- CRUD operations for action items and transcripts
- Filtering by status (open/completed)
- Tagging system
- Transcript history (last 5)
- Health monitoring page
- Material-UI responsive design
- Error handling and validation
- Database setup automation
- CORS configuration
- RESTful API with automatic documentation


## Troubleshooting

### Backend won't start
- Verify virtual environment is activated: `.\venv\Scripts\Activate.ps1`
- Check that `backend\.env` file exists with `GOOGLE_API_KEY` set
- Run `python setup_db.py` to initialize the database

### Database connection errors
- Run `python setup_db.py` — this creates the `meetingtracker.db` file automatically
- SQLite is file-based and requires no server or service


### Action items not extracted
- Verify the backend is running and LLM shows "HEALTHY" on the Status page
- If you get empty results, it may be a temporary rate limit — try again after a minute

## License

MIT

## Author

See ABOUTME.md for developer information.
