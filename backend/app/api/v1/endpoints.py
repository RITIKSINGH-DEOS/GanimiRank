from fastapi import APIRouter
from app.schemas.keyword import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse()
