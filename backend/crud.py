from sqlalchemy.orm import Session
from . import models, schemas

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_clients(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Client).offset(skip).limit(limit).all()

# 2. Cadastro de Produtos
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Product).offset(skip).limit(limit).all()

# 3. Cadastro de Veículos
def create_vehicle(db: Session, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_vehicles(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Vehicle).offset(skip).limit(limit).all()

# Cadastro de Motoristas
def create_driver(db: Session, driver: schemas.DriverCreate):
    db_driver = models.Driver(**driver.dict())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def get_drivers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Driver).offset(skip).limit(limit).all()

# 4. Cadastro de Pontos de Distribuição
def create_distribution_point(db: Session, point: schemas.DistributionPointCreate):
    db_point = models.DistributionPoint(**point.dict())
    db.add(db_point)
    db.commit()
    db.refresh(db_point)
    return db_point

def get_distribution_points(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.DistributionPoint).offset(skip).limit(limit).all()

# 5. Importação de Dados de Localização dos Veículos
def create_vehicle_location(db: Session, location: schemas.VehicleLocationCreate):
    db_location = models.VehicleLocation(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_vehicle_locations(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.VehicleLocation).offset(skip).limit(limit).all()

# 6. Seleção de Melhor Veículo para Realizar uma Entrega
# Função para selecionar o veículo com base em critérios específicos.

def select_best_vehicle_for_delivery(db: Session, delivery_id: int):
    # Exemplificando um critério simples de seleção (veículo com maior capacidade disponível).
    available_vehicles = db.query(models.Vehicle).filter_by(is_available=True).all()
    best_vehicle = max(available_vehicles, key=lambda v: v.capacity, default=None)
    if best_vehicle:
        # Atualizar o estado do veículo ou atribuir a entrega
        best_vehicle.is_available = False  # Exemplo de atualização de status
        db.commit()
    return best_vehicle

# 7. Geração de Rotas de Entrega
def create_route(db: Session, route: schemas.RouteCreate):
    db_route = models.Route(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

def get_routes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Route).offset(skip).limit(limit).all()

# 8. Visualização Geográfica de Clientes, Pontos de Distribuição, Veículos e Rotas
# Esta função apenas exemplifica uma consulta para obter as localizações geográficas.
def get_geographic_data(db: Session):
    clients = db.query(models.Client).all()
    distribution_points = db.query(models.DistributionPoint).all()
    vehicles = db.query(models.Vehicle).all()
    routes = db.query(models.Route).all()
    return {"clients": clients, "distribution_points": distribution_points, "vehicles": vehicles, "routes": routes}

# 9. Relatório de Entregas por Veículo e por Período
def get_deliveries_report(db: Session, vehicle_id: int, start_date, end_date):
    return db.query(models.Delivery).filter(
        models.Delivery.vehicle_id == vehicle_id,
        models.Delivery.date >= start_date,
        models.Delivery.date <= end_date
    ).all()

# 10. Visualização Geográfica dos Produtos Entregues
def get_delivered_products_map_data(db: Session):
    delivered_products = db.query(models.Delivery).filter(models.Delivery.status == 'delivered').all()
    return delivered_products