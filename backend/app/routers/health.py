from fastapi import APIRouter
from app.database import check_db_connection
from app.services.llm_service import LLMService
from app.schemas import HealthCheck
from datetime import datetime

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/", response_model=HealthCheck)
def health_check():
    """Check system health status"""
    
    # Check database connection
    db_status = "healthy" if check_db_connection() else "unhealthy"
    
    # Check LLM service
    llm_status = "healthy"
    try:
        llm_service = LLMService()
        if not llm_service.check_service_health():
            llm_status = "unhealthy"
    except Exception:
        llm_status = "unhealthy"
    
    # Overall status
    overall_status = "healthy" if db_status == "healthy" and llm_status == "healthy" else "unhealthy"
    
    return HealthCheck(
        status=overall_status,
        database=db_status,
        llm_service=llm_status,
        timestamp=datetime.now()
    )