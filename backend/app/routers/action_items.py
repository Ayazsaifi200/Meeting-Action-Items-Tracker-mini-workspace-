from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, check_db_connection
from app.models import ActionItem as ActionItemModel, Transcript as TranscriptModel
from app.schemas import ActionItem, ActionItemCreate, ActionItemUpdate
from datetime import datetime

router = APIRouter(prefix="/action-items", tags=["action-items"])

@router.get("/", response_model=List[ActionItem])
def get_action_items(
    transcript_id: int = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get all action items with optional filtering"""
    query = db.query(ActionItemModel)
    
    if transcript_id:
        query = query.filter(ActionItemModel.transcript_id == transcript_id)
    
    if status:
        query = query.filter(ActionItemModel.status == status)
    
    return query.all()

@router.get("/{item_id}", response_model=ActionItem)
def get_action_item(item_id: int, db: Session = Depends(get_db)):
    """Get specific action item"""
    item = db.query(ActionItemModel).filter(ActionItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return item

@router.post("/", response_model=ActionItem)
def create_action_item(item: ActionItemCreate, db: Session = Depends(get_db)):
    """Create new action item"""
    # Verify transcript exists
    transcript = db.query(TranscriptModel).filter(TranscriptModel.id == item.transcript_id).first()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    db_item = ActionItemModel(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=ActionItem)
def update_action_item(item_id: int, item: ActionItemUpdate, db: Session = Depends(get_db)):
    """Update action item"""
    db_item = db.query(ActionItemModel).filter(ActionItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    # Update fields
    update_data = item.dict(exclude_unset=True)
    if update_data:
        for field, value in update_data.items():
            setattr(db_item, field, value)
        db_item.updated_at = datetime.now()
        db.commit()
        db.refresh(db_item)
    
    return db_item

@router.delete("/{item_id}")
def delete_action_item(item_id: int, db: Session = Depends(get_db)):
    """Delete action item"""
    db_item = db.query(ActionItemModel).filter(ActionItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Action item deleted successfully"}

@router.patch("/{item_id}/complete")
def mark_complete(item_id: int, db: Session = Depends(get_db)):
    """Mark action item as completed"""
    db_item = db.query(ActionItemModel).filter(ActionItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    db_item.status = "completed"
    db_item.updated_at = datetime.now()
    db.commit()
    db.refresh(db_item)
    return db_item