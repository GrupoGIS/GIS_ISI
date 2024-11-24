from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
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
@router.get("/clients/", response_model=List[schemas.Client], dependencies=[Depends(is_employee)])
def read_clients(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    return clients

@router.get("/client/", response_model=schemas.Client, dependencies=[Depends(is_employee)])
async def read_client(
    client_id: int = Query(None, description="ID do cliente (prioridade se fornecido)"),
    name: str = Query(None, description="Nome do cliente (caso o ID não seja fornecido)"),
    db: AsyncSession = Depends(get_db)
):
    client = await crud.get_client_by_id_or_name(db, client_id=client_id, name=name)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return client