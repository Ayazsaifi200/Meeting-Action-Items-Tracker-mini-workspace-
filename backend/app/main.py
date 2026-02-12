from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routers import action_items, transcripts, health

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Meeting Action Items Tracker API",
    description="A web application to extract and track action items from meeting transcripts",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)

@app.get("/")
def read_root():
    return {
        "message": "Meeting Action Items Tracker API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }