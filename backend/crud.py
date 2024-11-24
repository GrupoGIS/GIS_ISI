from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import services.routing
import models
import schemas

# 1. Cadastro de Clientes
async def create_client(db: AsyncSession, client: schemas.ClientCreate):
    # Se cliente possui produtos, associar durante a criação
    db_client = models.Client(**client.dict(exclude={"products"}))
    if client.products:
        for product in client.products:
            db_product = models.Product(**product.dict())
            db_client.products.append(db_product)
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    return db_client

async def get_clients(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Cliente).offset(skip).limit(limit))
    return result.scalars().all()

# Função para obter um cliente pelo ID ou nome
async def get_client_by_id_or_name(db: AsyncSession, client_id: int = None, name: str = None):
    query = select(Client)
    if client_id is not None:
        query = query.filter(Client.id == client_id)
    elif name:
        query = query.filter(Client.nome.ilike(f"%{name}%"))
    else:
        return None

    result = await db.execute(query)
    return result.scalars().first()

# 2. Cadastro de Produtos
async def create_product(db: AsyncSession, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict(), fk_id_cliente=client_id)
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

async def get_products(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Produto).offset(skip).limit(limit))
    return result.scalars().all()

async def get_products_by_client(db: AsyncSession, client_id: int):
    result = await db.execute(
        select(models.Product).where(models.Product.fk_id_cliente == client_id)
    )
    return result.scalars().all()

# Buscar produto por ID
async def get_product_by_id(db: AsyncSession, product_id: int):
    result = await db.execute(select(models.Product).where(models.Product.id == product_id))
    return result.scalars().first()

# Buscar produtos por nome
async def get_product_by_name(db: AsyncSession, name: str):
    result = await db.execute(select(models.Product).where(models.Product.nome.ilike(f"%{name}%")))
    return result.scalars().all()


# 3. Cadastro de Veículos
async def create_vehicle(db: AsyncSession, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Vehicle(**vehicle.dict(exclude={"location"}))
    if vehicle.location:
        location = models.VehicleLocation(**vehicle.location.dict())
        db_vehicle.location = location
    db.add(db_vehicle)
    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle


async def get_vehicles(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Veiculo).offset(skip).limit(limit))
    return result.scalars().all()

# Cadastro de Motoristas
async def create_driver(db: AsyncSession, driver: schemas.DriverCreate):
    db_driver = models.Driver(**driver.dict(exclude={"vehicle"}))
    if driver.vehicle:
        vehicle = await db.get(models.Vehicle, driver.vehicle.id)
        if vehicle:
            db_driver.vehicle = vehicle
    db.add(db_driver)
    await db.commit()
    await db.refresh(db_driver)
    return db_driver

async def get_drivers(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Motorista).offset(skip).limit(limit))
    return result.scalars().all()

# 4. Cadastro de Pontos de Distribuição
async def create_distribution_point(db: AsyncSession, point: schemas.DistributionPointCreate):
    db_point = models.PontoDistribuicao(**point.dict())
    db.add(db_point)
    await db.commit()
    await db.refresh(db_point)
    return db_point

async def get_distribution_points(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.PontoDistribuicao).offset(skip).limit(limit))
    return result.scalars().all()

# 5. Importação de Dados de Localização dos Veículos
async def create_vehicle_location(db: AsyncSession, location: schemas.VehicleLocationCreate):
    db_location = models.LocalizacaoVeiculo(**location.dict())
    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)
    return db_location

async def get_vehicle_locations(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.LocalizacaoVeiculo).offset(skip).limit(limit))
    return result.scalars().all()

# 6. Seleção de Melhor Veículo para Realizar uma Entrega
async def select_best_vehicle_for_delivery(db: AsyncSession, delivery_id: int):
    result = await db.execute(select(models.Vehicle).filter_by(is_available=True))
    available_vehicles = result.scalars().all()
    best_vehicle = max(available_vehicles, key=lambda v: v.capacidade, default=None)
    if best_vehicle:
        best_vehicle.is_available = False
        db_delivery = await db.get(models.Delivery, delivery_id)
        if db_delivery:
            db_delivery.vehicle = best_vehicle
        await db.commit()
    return best_vehicles

# 7. Geração de Rotas de Entrega
async def create_route(db: AsyncSession, delivery_id: int, origin: str, destination: str):

    google_route = await get_google_route(origin, destination)

    # Criar a rota no banco de dados
    db_route = models.Route(
        origem=origin,
        destino=destination,
        distancia_m=google_route["distance"], 
        tempo_estimado=google_route["duration"], 
    )

    # Associar a rota à entrega
    delivery = await db.get(models.Delivery, delivery_id)
    if delivery:
        db_route.delivery = delivery
    else:
        raise Exception("Entrega não encontrada.")

    db.add(db_route)
    await db.commit()
    await db.refresh(db_route)
    return db_route

async def get_routes(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Rota).offset(skip).limit(limit))
    return result.scalars().all()

# 8. Visualização Geográfica de Dados
async def get_geographic_data(db: AsyncSession):
    clients = await db.execute(select(models.Cliente))
    distribution_points = await db.execute(select(models.PontoDistribuicao))
    vehicles = await db.execute(select(models.Veiculo))
    routes = await db.execute(select(models.Rota))
    return {
        "Clientes": clients.scalars().all(),
        "Pontos_Distribuicao": distribution_points.scalars().all(),
        "Veiculos": vehicles.scalars().all(),
        "Rotas": routes.scalars().all(),
    }

# 9. Relatório de Entregas por Veículo e por Período
async def get_deliveries_report(db: AsyncSession, vehicle_id: int):
    result = await db.execute(
        select(models.Delivery)
        .filter(models.Delivery.fk_id_vehicle == vehicle_id)
        .options(selectinload(models.Delivery.product), selectinload(models.Delivery.distribution_point))
    )
    return result.scalars().all()

# 10. Visualização Geográfica dos Produtos Entregues
async def get_delivered_products_map_data(db: AsyncSession):
    result = await db.execute(
        select(models.Entrega).filter(models.Entrega.is_delivered == True)
    )
    return result.scalars().all()
