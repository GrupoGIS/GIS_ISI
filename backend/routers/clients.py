from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import sys
from .auth import is_employee
sys.path.append("backend")
# Importações ajustadas para manter a organização do projeto
import crud
import schemas
from database import get_db
from fastapi import APIRouter, Depends

# Criação do roteador
router = APIRouter()

# Endpoint para criar clientes
@router.post("/create_clients/", response_model=schemas.Client, dependencies=[Depends(is_employee)])
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db=db, client=client)

# Endpoint para listar clientes
@router.get("/clients/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients
