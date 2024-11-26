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

# Criação do roteador
router = APIRouter()

# Endpoint para criar motorista
@router.post("/create_driver/", response_model=schemas.Driver, dependencies=[Depends(is_employee)])
async def create_driver(driver: schemas.DriverCreate, db: AsyncSession = Depends(get_db)):
    try:
        created_driver = await crud.create_driver(db=db, driver=driver)
        return created_driver
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Erro ao criar o motorista. Verifique se o usuário já existe.")

# Endpoint para listar todos os motoristas
@router.get("/drivers/", response_model=List[schemas.Driver], dependencies=[Depends(is_employee)])
async def list_drivers(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    drivers = await crud.get_drivers(db, skip=skip, limit=limit)
    return drivers

# Endpoint para obter motorista por ID
@router.get("/driver/{driver_id}/", response_model=schemas.Driver, dependencies=[Depends(is_employee)])
async def get_driver_by_id(driver_id: int, db: AsyncSession = Depends(get_db)):
    driver = await crud.get_driver_by_id(db, driver_id=driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return driver