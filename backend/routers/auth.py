from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from datetime import datetime, timedelta
from database import get_db
from models import User
from jose import JWTError
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordBearer
import uuid

# Configurações do JWT
SECRET_KEY = str(uuid.uuid4()).replace("-", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Hash de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

router = APIRouter()

def verify_password(plain_password, hashed_password, salt):
    return pwd_context.verify(plain_password + salt, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Usuário não autenticado")
    return payload

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/login")
async def login(email: str, password: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    # Verifica a senha com o salt
    if not verify_password(password, user.password_hash, user.salt):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    # Cria o token com as permissões do usuário
    access_token = create_access_token(data={
        "sub": user.id,
        "is_client": user.is_client,
        "is_driver": user.is_driver,
        "is_employee": user.is_employee
    })
    return {"access_token": access_token, "token_type": "bearer"}


## permissions
def is_employee(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_employee"):
        raise HTTPException(
            status_code=403, detail="Acesso permitido apenas para funcionários"
        )

def is_driver(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_driver"):
        raise HTTPException(
            status_code=403, detail="Acesso permitido apenas para motoristas"
        )

def is_client(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_client"):
        raise HTTPException(
            status_code=403, detail="Acesso permitido apenas para clientes"
        )