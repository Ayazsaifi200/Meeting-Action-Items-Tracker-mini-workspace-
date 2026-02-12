# ✅ Pre-Launch Checklist

## Before Starting the Application

### 1. Google Gemini API Key ⚠️ CRITICAL
- [ ] Created Google AI account
- [ ] Generated API key from https://aistudio.google.com/apikey
- [ ] API key is copied
- [ ] API key is pasted in `backend\.env` as `GOOGLE_API_KEY=...`

**Test your API key:**
Visit Google AI Studio and try running a test prompt to ensure your key works.

---

### 2. Python Environment
- [ ] Python 3.11.6 is installed
- [ ] Virtual environment created in `backend\venv\`
- [ ] All packages installed (check with `pip list` in venv)

**Verify packages:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip list | findstr fastapi
# Should show fastapi and other packages
```

---

### 3. Node.js Environment
- [ ] Node.js 16+ is installed
- [ ] npm is installed
- [ ] `node_modules\` folder exists in project root
- [ ] All React dependencies installed

**Verify:**
```powershell
node --version
npm --version
# Should show versions
```

---

### 4. Configuration Files
- [ ] `backend\.env` exists (NOT `.env.example`)
- [ ] `backend\.env` has your actual Google API key

**Critical check - backend\.env should contain:**
```env
GOOGLE_API_KEY=YOUR_ACTUAL_API_KEY_HERE  ← Change this!
```

**Note:** The database uses SQLite — no server or password needed. The database file (`meetingtracker.db`) is created automatically.

---

## Starting the Application

### Option 1: Using Batch Scripts (Easy)

**Terminal 1:**
```powershell
.\start-backend.bat
```

**Terminal 2:**
```powershell
.\start-frontend.bat
```

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python setup_db.py          # First time only - creates SQLite database
python run.py
```

**Terminal 2 - Frontend:**
```powershell
# From project root
npm start
```

---

## Verification Steps

### Step 1: Backend Health Check ✅
- [ ] Backend started without errors
- [ ] Visit http://localhost:8000
- [ ] Visit http://localhost:8000/docs (should show API documentation)
- [ ] Visit http://localhost:8000/health

**Expected health check response:**
```json
{
  "status": "healthy",
  "database": "healthy",
  "llm_service": "healthy",
  "timestamp": "2026-02-12T..."
}
```

**If database is "unhealthy":**
- Run `python setup_db.py` in the backend directory
- Ensure `meetingtracker.db` file exists in backend folder

**If llm_service is "unhealthy":**
- Verify GOOGLE_API_KEY in `backend\.env`
- Check internet connection
- Wait 1-2 minutes if you hit the free tier rate limit

---

### Step 2: Frontend Health Check ✅
- [ ] Frontend started without errors
- [ ] Browser opened to http://localhost:3000
- [ ] Home page loads properly
- [ ] Click "Check System Status"
- [ ] All three indicators are GREEN (Backend, Database, LLM)

---

### Step 3: End-to-End Test ✅

#### Test A: Process a Meeting Transcript
1. [ ] Navigate to "Process Meeting"
2. [ ] Enter title: "Test Meeting - Feb 12"
3. [ ] Paste this test transcript:
```
John: We need to finalize the project proposal by Friday, March 15th.
Sarah: I'll review the budget section tomorrow afternoon.
Mike: Can someone send me the design mockups? I need them by end of day.
Lisa: I'll schedule the client meeting for next week.
```
4. [ ] Click "Process Transcript"
5. [ ] Should redirect to Action Items page
6. [ ] Should see 3-4 extracted action items
7. [ ] Items should have task descriptions
8. [ ] Some items should have owners (John, Sarah, Mike, Lisa)
9. [ ] Some items should have due dates

#### Test B: Manage Action Items
1. [ ] Mark an item as complete (click checkbox)
2. [ ] Item should show as completed with strikethrough
3. [ ] Click "Edit" on an item
4. [ ] Modify the task, owner, or due date
5. [ ] Save changes
6. [ ] Changes should appear immediately
7. [ ] Click "Add Action Item"
8. [ ] Fill in a new manual task
9. [ ] Save
10. [ ] New item should appear in list
11. [ ] Delete an item
12. [ ] Confirm deletion

#### Test C: Filtering
1. [ ] Use filter dropdown
2. [ ] Select "Open" - should show only pending items
3. [ ] Select "Completed" - should show only completed items
4. [ ] Select "All Items" - should show everything

#### Test D: History
1. [ ] Navigate to "History"
2. [ ] Should see your test transcript listed
3. [ ] Click "View" icon
4. [ ] Should show action items for that transcript
5. [ ] Click "Delete" icon
6. [ ] Confirm deletion
7. [ ] Transcript should be removed

---

## Troubleshooting Common Issues

### "Module not found" Error (Python)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### "Cannot find module" Error (React)
```powershell
npm install
```

### Port 8000 Already in Use
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Port 3000 Already in Use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Database Issues
```powershell
# Re-create the SQLite database
cd backend
.\venv\Scripts\Activate.ps1
python setup_db.py
```

### LLM Rate Limit (429 Error)
- The free tier has per-minute and per-day limits
- Wait 1-2 minutes and try again
- Avoid refreshing the Status page repeatedly (it uses API calls)
- The app has built-in retry logic with 30s/60s backoff

---

## Success Criteria ✅

You're ready to demo/use the app when:

- [x] ✅ Backend shows startup message on port 8000
- [x] ✅ Frontend opens browser on port 3000
- [x] ✅ `/health` endpoint shows all "healthy"
- [x] ✅ Status page shows all green indicators
- [x] ✅ Can process a test transcript
- [x] ✅ AI extracts action items automatically
- [x] ✅ Can add, edit, delete, and complete items
- [x] ✅ Filtering works (open/completed)
- [x] ✅ History shows processed transcripts
- [x] ✅ No error messages in console

---

## Performance Benchmarks

Expected behavior:
- Backend startup: 2-5 seconds
- Frontend startup: 10-30 seconds
- Transcript processing: 3-8 seconds (depends on LLM API)
- Page load time: <1 second
- CRUD operations: <500ms

---

## What to Show in Demo

1. **Home Page** - Feature overview
2. **Process Meeting** - Paste transcript, show AI extraction
3. **Action Items** - Show CRUD operations and filtering
4. **History** - Show last 5 transcripts
5. **Status Page** - Show health monitoring

---

## Final Pre-Launch Commands

Run these to ensure everything is ready:

```powershell
# Check Python
python --version

# Check Node
node --version

# Check npm
npm --version

# Test backend imports (in venv)
cd backend
.\venv\Scripts\Activate.ps1
python -c "import fastapi; import sqlalchemy; import google.generativeai; print('All imports OK')"

# Check React dependencies
cd ..
npm list react react-dom @mui/material
```

If all commands succeed, you're ready to launch! 🚀

---

**Last Updated**: February 12, 2026
**Database**: SQLite (no server needed)
**LLM Model**: Google Gemini 2.5 Flash
**Status**: Ready for Launch