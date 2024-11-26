from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud
import schemas
from database import get_db
from .auth import is_employee

router = APIRouter()

# Endpoint to create a route
@router.post("/create_route/", response_model=schemas.Route, dependencies=[Depends(is_employee)])
async def create_route(route: schemas.RouteCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_route(db=db, route=route)

# Endpoint to list all routes
@router.get("/routes/", response_model=List[schemas.Route], dependencies=[Depends(is_employee)])
async def read_routes(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    routes = await crud.get_routes(db, skip=skip, limit=limit)
    return routes

# Endpoint to get a specific route by its ID
@router.get("/routes/{route_id}", response_model=schemas.Route, dependencies=[Depends(is_employee)])
async def read_route(route_id: int, db: AsyncSession = Depends(get_db)):
    route = await crud.get_route(db, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

# Endpoint to update a route
@router.put("/routes/{route_id}", response_model=schemas.Route, dependencies=[Depends(is_employee)])
async def update_route(route_id: int, route: schemas.RouteUpdate, db: AsyncSession = Depends(get_db)):
    existing_route = db.query(Route).filter(Route.id == route_id).first()
    if not existing_route:
        return None

    for key, value in route.dict(exclude_unset=True).items():
        setattr(existing_route, key, value)

    db.commit()
    db.refresh(existing_route)
    return existing_route
