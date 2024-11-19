from sqlalchemy.orm import Session
import sys
sys.path.append("backend")
import models, schemas

# 1. Cadastro de Clientes
def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Cliente(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_clients(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

# 2. Cadastro de Produtos
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Produto(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Produto).offset(skip).limit(limit).all()

# 3. Cadastro de Veículos
def create_vehicle(db: Session, vehicle: schemas.VehicleCreate):
    db_vehicle = models.Veiculo(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_vehicles(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Veiculo).offset(skip).limit(limit).all()

# Cadastro de Motoristas
def create_driver(db: Session, driver: schemas.DriverCreate):
    db_driver = models.Motorista(**driver.dict())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver

def get_drivers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Motorista).offset(skip).limit(limit).all()

# 4. Cadastro de Pontos de Distribuição
def create_distribution_point(db: Session, point: schemas.DistributionPointCreate):
    db_point = models.PontoDistribuicao(**point.dict())
    db.add(db_point)
    db.commit()
    db.refresh(db_point)
    return db_point

def get_distribution_points(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.PontoDistribuicao).offset(skip).limit(limit).all()

# 5. Importação de Dados de Localização dos Veículos
def create_vehicle_location(db: Session, location: schemas.VehicleLocationCreate):
    db_location = models.LocalizacaoVeiculo(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_vehicle_locations(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.LocalizacaoVeiculo).offset(skip).limit(limit).all()

# 6. Seleção de Melhor Veículo para Realizar uma Entrega
def select_best_vehicle_for_delivery(db: Session, delivery_id: int):
    available_vehicles = db.query(models.Veiculo).filter_by(is_available=True).all()
    best_vehicle = max(available_vehicles, key=lambda v: v.capacidade, default=None)
    if best_vehicle:
        best_vehicle.is_available = False
        db.commit()
    return best_vehicle

# 7. Geração de Rotas de Entrega
def create_route(db: Session, route: schemas.RouteCreate):
    db_route = models.Rota(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

def get_routes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Rota).offset(skip).limit(limit).all()

# 8. Visualização Geográfica de Clientes, Pontos de Distribuição, Veículos e Rotas
def get_geographic_data(db: Session):
    clients = db.query(models.Cliente).all()
    distribution_points = db.query(models.PontoDistribuicao).all()
    vehicles = db.query(models.Veiculo).all()
    routes = db.query(models.Rota).all()
    return {"Clientes": clients, "Pontos_Distribuicao": distribution_points, "Veiculos": vehicles, "Rotas": routes}

# 9. Relatório de Entregas por Veículo e por Período
def get_deliveries_report(db: Session, vehicle_id: int):
    return db.query(models.Delivery).filter(
        models.Entrega.fk_id_veiculo == vehicle_id
    ).all()

# 10. Visualização Geográfica dos Produtos Entregues
def get_delivered_products_map_data(db: Session):
    delivered_products = db.query(models.Entrega).filter(models.Entrega.is_delivered == 'True').all()
    return delivered_products
