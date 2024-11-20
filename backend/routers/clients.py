from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import sys
sys.path.append("backend")
# Importações ajustadas para manter a organização do projeto
import crud
import schemas
from database import get_db

# Criação do roteador
router = APIRouter()

# Endpoint para criar clientes
@router.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    """
    Cria um novo cliente no sistema.
    """
    return crud.create_client(db=db, client=client)

# Endpoint para listar clientes
@router.get("/clients/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    Retorna uma lista de clientes cadastrados, com suporte a paginação.
    """
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients
