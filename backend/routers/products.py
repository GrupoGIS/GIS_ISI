from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import sys
from database import get_db
from .auth import get_current_user, is_client, is_employee
sys.path.append("backend")
import crud
import schemas
import models

router = APIRouter()

@router.post("/create_product/", response_model=schemas.Product, dependencies=[Depends(is_employee)])
async def create_product(
    product: schemas.ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    result = await db.execute(select(models.Client).where(models.Client.id == product.fk_id_cliente))
    client = result.scalars().first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    created_product = await crud.create_product(db, product, product.fk_id_cliente)
    return created_product

# Rota para obter produtos do cliente autenticado
@router.get("/products/my/", response_model=list[schemas.Product], dependencies=[Depends(is_client)])
async def get_my_products(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Obtém o ID do usuário autenticado
    user_id = current_user.get("id")

    # Busca o cliente associado ao usuário autenticado
    result = await db.execute(select(models.Client).where(models.Client.fk_id_usuario == user_id))
    client = result.scalars().first()

    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    # Busca os produtos do cliente
    products = await crud.get_products_by_client(db, client_id=client.id)

    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado.")

    return products


@router.get("/product/{query}", response_model=list[schemas.Product], dependencies=[Depends(is_employee)])
async def get_product_by_id_or_name(query: str, db: AsyncSession = Depends(get_db)):
    if query.isdigit():  # Se a query for um número, buscar por ID
        product = await crud.get_product_by_id(db, int(query))
        if not product:
            raise HTTPException(status_code=404, detail="Produto com esse ID não encontrado.")
        return [product]
    else:  # Caso contrário, buscar por nome
        products = await crud.get_product_by_name(db, query)
        if not products:
            raise HTTPException(status_code=404, detail="Nenhum produto encontrado com esse nome.")
        return products


@router.get("/products/", response_model=list[schemas.Product], dependencies=[Depends(is_employee)])
async def get_all_products(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    products = await crud.get_products(db, skip=skip, limit=limit)
    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado.")
    return products