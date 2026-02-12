from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.database import get_db
from app.models import Transcript as TranscriptModel, ActionItem as ActionItemModel
from app.schemas import Transcript, TranscriptCreate
from app.services.llm_service import LLMService
from datetime import datetime

router = APIRouter(prefix="/transcripts", tags=["transcripts"])

@router.get("/", response_model=List[Transcript])
def get_transcripts(limit: int = 5, db: Session = Depends(get_db)):
    """Get recent transcripts (default last 5)"""
    transcripts = db.query(TranscriptModel).order_by(desc(TranscriptModel.created_at)).limit(limit).all()
    return transcripts

@router.get("/{transcript_id}", response_model=Transcript)
def get_transcript(transcript_id: int, db: Session = Depends(get_db)):
    """Get specific transcript with action items"""
    transcript = db.query(TranscriptModel).filter(TranscriptModel.id == transcript_id).first()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    return transcript

@router.post("/", response_model=Transcript)
def create_transcript(transcript: TranscriptCreate, db: Session = Depends(get_db)):
    """Create new transcript and extract action items"""
    try:
        # Create transcript
        db_transcript = TranscriptModel(**transcript.dict())
        db.add(db_transcript)
        db.commit()
        db.refresh(db_transcript)
        
        # Extract action items using LLM
        llm_service = LLMService()
        action_items = llm_service.extract_action_items(transcript.content)
        
        # Save action items
        for item_data in action_items:
            action_item = ActionItemModel(
                task=item_data.get('task', ''),
                owner=item_data.get('owner'),
                due_date=item_data.get('due_date'),
                tags=item_data.get('tags'),
                transcript_id=db_transcript.id
            )
            db.add(action_item)
        
        # Update transcript as processed
        db_transcript.processed_at = datetime.now()
        db.commit()
        db.refresh(db_transcript)
        
        return db_transcript
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing transcript: {str(e)}")

@router.delete("/{transcript_id}")
def delete_transcript(transcript_id: int, db: Session = Depends(get_db)):
    """Delete transcript and all associated action items"""
    transcript = db.query(TranscriptModel).filter(TranscriptModel.id == transcript_id).first()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    db.delete(transcript)
    db.commit()
    return {"message": "Transcript deleted successfully"}