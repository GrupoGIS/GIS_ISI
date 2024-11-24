# routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db
from .auth import is_employee

router = APIRouter()

@router.post("/create_distribution_point/", response_model=schemas.DistributionPoint, dependencies=[Depends(is_employee)])
def create_distribution_point(point: schemas.DistributionPointCreate, db: Session = Depends(get_db)):
    return crud.create_distribution_point(db=db, point=point)

# Endpoint para listar todos os pontos de distribuição
@router.get("/distribution_points/", response_model=List[schemas.DistributionPoint], dependencies=[Depends(is_employee)])
def read_distribution_points(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    points = crud.get_distribution_points(db, skip=skip, limit=limit)
    return points

# Endpoint para obter um ponto de distribuição específico
@router.get("/distribution_points/{point_id}", response_model=schemas.DistributionPoint)
def read_distribution_point(point_id: int, db: Session = Depends(get_db)):
    point = crud.get_distribution_point(db, point_id)
    if point is None:
        raise HTTPException(status_code=404, detail="Ponto de Distribuição não encontrado")
    return point
