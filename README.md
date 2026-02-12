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
- Material-UI (MUI)
- React Router
- Axios for API calls
- date-fns for date formatting

### Backend
- Python 3.11+
- FastAPI 0.104.1
- SQLAlchemy 2.0.23 (ORM)
- Uvicorn (ASGI server)

### Database
- SQLite (built-in, no server needed)

### LLM
- Google Gemini 2.5 Flash via google-generativeai library

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
│   │   ├── models/          # Database models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic (LLM service)
│   │   ├── database.py      # Database configuration
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── main.py          # FastAPI app
│   ├── venv/                # Virtual environment
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (create from .env.example)
│   ├── meetingtracker.db    # SQLite database (auto-created)
│   ├── setup_db.py          # Database setup script
│   └── run.py               # Server runner
├── src/
│   ├── components/          # React components
│   │   ├── HomePage.js
│   │   ├── TranscriptProcessor.js
│   │   ├── ActionItemsList.js
│   │   ├── TranscriptHistory.js
│   │   └── HealthStatus.js
│   ├── services/
│   │   └── api.js           # API client
│   ├── App.js               # Main React app
│   └── index.js             # Entry point
├── public/
├── package.json
└── README.md
```

## API Endpoints

### Health
- `GET /health` - System health check

### Transcripts
- `GET /transcripts/` - Get recent transcripts (default: 5)
- `GET /transcripts/{id}` - Get specific transcript
- `POST /transcripts/` - Create and process transcript
- `DELETE /transcripts/{id}` - Delete transcript

### Action Items
- `GET /action-items/` - Get all action items (filterable)
- `GET /action-items/{id}` - Get specific action item
- `POST /action-items/` - Create action item
- `PUT /action-items/{id}` - Update action item
- `DELETE /action-items/{id}` - Delete action item
- `PATCH /action-items/{id}/complete` - Mark as completed

## What's Done ✅

- [x] Full-stack architecture (React + FastAPI + SQLite)
- [x] AI-powered action item extraction using Google Gemini 2.5 Flash
- [x] CRUD operations for action items and transcripts
- [x] Filtering by status (open/completed)
- [x] Tagging system
- [x] Transcript history (last 5)
- [x] Health monitoring page
- [x] Material-UI responsive design
- [x] Error handling and validation
- [x] Database setup automation
- [x] CORS configuration
- [x] RESTful API with automatic documentation

## What's Not Done ❌

- [ ] User authentication/authorization
- [ ] Advanced search functionality
- [ ] Export action items (CSV, PDF)
- [ ] Email notifications for due dates
- [ ] Real-time collaboration features
- [ ] Pagination for large datasets
- [ ] Unit tests and integration tests
- [ ] Docker containerization
- [ ] Production deployment configuration
- [ ] Advanced analytics dashboard

## Troubleshooting

### Backend won't start
- Verify virtual environment is activated
- Check `.env` file has the GOOGLE_API_KEY set
- Run `python setup_db.py` to initialize the database

### Database connection errors
- Run `python setup_db.py` to create the SQLite database file
- Ensure `meetingtracker.db` exists in the backend directory

### LLM service unhealthy
- Verify `GOOGLE_API_KEY` in `.env` is valid
- Check internet connection
- Ensure API key has Gemini API access enabled

### LLM returns empty results or 429 errors
- Free-tier Gemini API has rate limits — wait 1–2 minutes and retry
- The app uses Gemini 2.5 Flash with built-in retry logic (3 attempts with backoff)
- Check quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:8000
- Check CORS settings in `backend/app/main.py`

## License

MIT

## Author

See ABOUTME.md for developer information.
