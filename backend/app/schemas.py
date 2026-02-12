from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Action Item schemas
class ActionItemBase(BaseModel):
    task: str
    owner: Optional[str] = None
    due_date: Optional[str] = None
    status: str = "pending"
    tags: Optional[str] = None

class ActionItemCreate(ActionItemBase):
    transcript_id: int

class ActionItemUpdate(BaseModel):
    task: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[str] = None

class ActionItem(ActionItemBase):
    id: int
    transcript_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Transcript schemas
class TranscriptBase(BaseModel):
    title: str
    content: str

class TranscriptCreate(TranscriptBase):
    pass

class Transcript(TranscriptBase):
    id: int
    created_at: datetime
    processed_at: Optional[datetime] = None
    action_items: List[ActionItem] = []
    
    class Config:
        from_attributes = True

# Health check schema
class HealthCheck(BaseModel):
    status: str
    database: str
    llm_service: str
    timestamp: datetime