from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
import sys
from .auth import is_employee
sys.path.append("backend")
import crud
import schemas
import models
from database import get_db
from fastapi import APIRouter, Depends


# Criação do roteador
router = APIRouter()

# Endpoint para criar clientes
@router.post("/create_clients/", response_model=schemas.Client, dependencies=[Depends(is_employee)])
async def create_client(client: schemas.ClientCreate, db: AsyncSession = Depends(get_db)):
    created_client = await crud.create_client(db=db, client=client)
    return created_client

# Endpoint para listar clientes
@router.get("/clients/", response_model=List[schemas.Client], dependencies=[Depends(is_employee)])
async def read_clients(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clients = await crud.get_clients(db, skip=skip, limit=limit)
    return clients

@router.get("/client/", response_model=schemas.Client, dependencies=[Depends(is_employee)])
async def read_client(
    client_id: int = Query(None, description="ID do cliente (prioridade se fornecido)"),
    name: str = Query(None, description="Nome do cliente (caso o ID não seja fornecido)"),
    db: AsyncSession = Depends(get_db)
):

    if client_id is None and name is None:
        raise HTTPException(
            status_code=400,
            detail="É necessário fornecer pelo menos um parâmetro: 'client_id' ou 'name'."
        )


    client = await crud.get_client_by_id_or_name(db, client_id=client_id, name=name)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return client