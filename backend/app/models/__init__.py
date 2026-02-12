from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Transcript(Base):
    __tablename__ = "transcripts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationship to action items
    action_items = relationship("ActionItem", back_populates="transcript", cascade="all, delete-orphan")

class ActionItem(Base):
    __tablename__ = "action_items"
    
    id = Column(Integer, primary_key=True, index=True)
    task = Column(Text, nullable=False)
    owner = Column(String(100), nullable=True)
    due_date = Column(String(50), nullable=True)  # Store as string since LLM might extract various formats
    status = Column(String(20), default="pending")  # pending, completed
    tags = Column(String(200), nullable=True)  # Comma-separated tags
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key to transcript
    transcript_id = Column(Integer, ForeignKey("transcripts.id"), nullable=False)
    transcript = relationship("Transcript", back_populates="action_items")