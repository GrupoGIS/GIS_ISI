from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from .auth import is_employee

router = APIRouter()

@router.post("/create_distribution_point/", response_model=schemas.DistributionPoint, dependencies=[Depends(is_employee)])
async def create_distribution_point(point: schemas.DistributionPointCreate, db: Session = Depends(get_db)):
    return await crud.create_distribution_point(db=db, point=point)

# Endpoint para listar todos os pontos de distribuição
@router.get("/distribution_points/", response_model=List[schemas.DistributionPoint], dependencies=[Depends(is_employee)])
async def read_distribution_points(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    points = await crud.get_distribution_points(db, skip=skip, limit=limit)
    return points

# Endpoint para obter um ponto de distribuição específico
@router.get("/distribution_point/{point_id}", response_model=schemas.DistributionPoint, dependencies=[Depends(is_employee)])
async def read_distribution_point(point_id: int, db: Session = Depends(get_db)):
    point = await crud.get_distribution_point(db, point_id)
    if point is None:
        raise HTTPException(status_code=404, detail="Ponto de Distribuição não encontrado")
    return point
