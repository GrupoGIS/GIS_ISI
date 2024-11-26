from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models import User
from backend.schemas import UserResponse
from backend.database import get_db

router = APIRouter()

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Retorna um usuário específico pelo ID.
    """
    # Consultar o usuário no banco de dados
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return user
