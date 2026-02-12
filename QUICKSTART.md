# 🚀 Quick Start Guide

## Prerequisites Check
✅ Python 3.11.6 - Installed
✅ Node.js & npm - Installed (from React setup)
✅ SQLite - Built-in (no installation needed)
✅ Git - Available

---

## ⚠️ IMPORTANT: Before Starting

### 1. Get Google Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create a new API key
4. Copy the key

**Edit** `backend\.env`:
```env
GOOGLE_API_KEY=paste_your_actual_api_key_here
```

---

## 🎯 Step-by-Step Startup

### Terminal 1: Backend Server

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Verify environment
python --version
# Should show: Python 3.11.6

# Setup database (only needed first time - creates SQLite file automatically)
python setup_db.py

# Start the server
python run.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test Backend:**
- Open browser: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

### Terminal 2: Frontend React App

Open a NEW PowerShell terminal:

```powershell
# From project root (mini-workspace)
cd D:\mini-workspace

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view mini-workspace in the browser.

  Local:            http://localhost:3000
```

The browser should automatically open to http://localhost:3000

---

## ✅ Verification Checklist

### Backend Health Check
1. Visit: http://localhost:8000/health
2. Should see:
   ```json
   {
     "status": "healthy",
     "database": "healthy",
     "llm_service": "healthy",
     "timestamp": "..."
   }
   ```

If `database` is unhealthy:
- Run `python setup_db.py` in the backend directory
- Ensure `meetingtracker.db` file exists in backend folder

If `llm_service` is unhealthy:
- Verify GOOGLE_API_KEY in `backend\.env`
- Check internet connection
- Confirm API key is valid

### Frontend Check
1. Visit: http://localhost:3000
2. Should see "Welcome to Meeting Action Items Tracker"
3. Click "Check System Status" → All should be green/healthy

---

## 🧪 Testing the Application

### Test 1: Process a Meeting
1. Click "Get Started" or navigate to "Process Meeting"
2. Enter title: "Weekly Team Meeting"
3. Paste this sample transcript:
```
Sarah: We need to finalize the Q1 budget report by Friday, March 15th.
John: I'll update the sales figures this afternoon.
Mike: Can someone review the marketing deck? I need feedback by tomorrow.
Sarah: I'll take a look at it, Mike.
John: Don't forget we need to schedule the client presentation. Let's aim for next week.
```
4. Click "Process Transcript"
5. Should redirect to Action Items page with extracted items

### Test 2: Manage Action Items
1. Mark an item as complete (click the checkbox)
2. Edit an item (click edit icon)
3. Add a new item manually
4. Delete an item
5. Filter by "Open" or "Completed"

### Test 3: View History
1. Navigate to "History"
2. Should see your processed transcript
3. Click view icon to see its action items

---

## 📁 Project Structure Reference

```
D:\mini-workspace\
├── backend\
│   ├── app\
│   │   ├── models\__init__.py       # Database models
│   │   ├── routers\
│   │   │   ├── action_items.py      # Action items API
│   │   │   ├── transcripts.py       # Transcripts API
│   │   │   └── health.py            # Health check API
│   │   ├── services\
│   │   │   └── llm_service.py       # Gemini integration
│   │   ├── database.py              # DB config
│   │   ├── schemas.py               # Pydantic models
│   │   └── main.py                  # FastAPI app
│   ├── venv\                        # Virtual environment
│   ├── meetingtracker.db             # SQLite database (auto-created)
│   ├── .env                         # ⚠️ CONFIG HERE
│   ├── requirements.txt
│   ├── setup_db.py
│   └── run.py
├── src\
│   ├── components\
│   │   ├── HomePage.js
│   │   ├── TranscriptProcessor.js
│   │   ├── ActionItemsList.js
│   │   ├── TranscriptHistory.js
│   │   └── HealthStatus.js
│   ├── services\
│   │   └── api.js
│   └── App.js
├── .env                             # Frontend config
├── package.json
├── README.md
├── AI_NOTES.md
├── ABOUTME.md
└── PROMPTS_USED.md
```

---

## 🔧 Troubleshooting

### "Database connection failed"
```powershell
# SQLite is file-based — no service to start
# Just re-run the setup script to recreate the database file:
cd backend
.\venv\Scripts\Activate.ps1
python setup_db.py

# Verify the database file exists:
Test-Path backend\meetingtracker.db
# Should return: True
```

### "Module not found" errors (Python)
```powershell
# Ensure virtual environment is activated
cd backend
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### "Cannot GET /" on React
```powershell
# Restart React dev server
# Press Ctrl+C to stop, then:
npm start
```

### LLM returns empty action items or errors
- **429 Rate Limit**: Free-tier Gemini API has quota limits. Wait 1–2 minutes and retry.
- The app uses **Gemini 2.5 Flash** with built-in retry logic (up to 3 attempts with backoff).
- If persistent, check your quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

### Port already in use
```powershell
# Backend (8000)
netstat -ano | findstr :8000
# Kill process if needed

# Frontend (3000)
netstat -ano | findstr :3000
```

---

## 🎉 Success!

If everything is green:
- ✅ Backend running on port 8000
- ✅ Database connected
- ✅ LLM service ready
- ✅ Frontend on port 3000

You're ready to track meeting action items with AI! 🚀

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Review `AI_NOTES.md` for technical details
3. Consult troubleshooting section above
4. Verify all environment variables in `.env` files

---

**Last Updated**: February 12, 2026