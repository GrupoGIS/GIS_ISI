from pydantic import BaseModel
from typing import Optional, List
from datetime import date


# Esquemas para a entidade Client (Cliente)
class ClientBase(BaseModel):
    nome: str
    end_rua: str
    end_bairro: str
    end_numero: int
    telefone: int

class ClientCreate(ClientBase):
    email: str  
    password: str 
    products: Optional[List["ProductCreate"]] = None

class Client(ClientBase):
    id: int
    fk_id_usuario: Optional[int]
    products: Optional[List["Product"]] = None  # Produtos associados

    class Config:
        orm_mode = True


# Esquemas para a entidade Product (Produto)
class ProductBase(BaseModel):
    nome: str
    descricao: str
    preco: int
    quantidade_estoque: int
    
class DistributionPointCreate(BaseModel):
    nome: str
    end_rua: str
    end_bairro: str
    end_numero: int
    tipo: str

class ProductCreate(BaseModel):
    nome: str
    descricao: str
    preco: int
    quantidade_estoque: int
    fk_id_cliente: int
    ponto_distribuicao: DistributionPointCreate | None = None  


class Product(ProductBase):
    id: int
    fk_id_cliente: Optional[int]

    class Config:
        orm_mode = True


# Esquemas para a entidade Vehicle (Veiculo)
class VehicleBase(BaseModel):
    placa: str
    modelo: str
    capacidade: int
    is_available: bool = True

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int
    fk_id_localizacao: Optional[int]
    deliveries: Optional[List["Delivery"]] = None  # Entregas associadas

    class Config:
        orm_mode = True

# Esquemas para a entidade Driver (Motorista)
class DriverBase(BaseModel):
    nome: str
    habilitacao: str
    telefone: int
    end_rua: str
    end_bairro: str
    end_numero: int

class DriverCreate(DriverBase):
    pass

class Driver(DriverBase):
    id: int
    fk_id_usuario: Optional[int]
    fk_id_veiculo: Optional[int]

    class Config:
        orm_mode = True


# Esquemas para a entidade DistributionPoint (PontoDistribuicao)
class DistributionPointBase(BaseModel):
    nome: str
    end_rua: str
    end_bairro: str
    end_numero: int
    tipo: str

class DistributionPointCreate(DistributionPointBase):
    pass

class DistributionPoint(DistributionPointBase):
    id: int

    class Config:
        orm_mode = True


# Esquemas para a entidade VehicleLocation (LocalizacaoVeiculo)
class VehicleLocationBase(BaseModel):
    latitude: float
    longitude: float
    data_hora: date

class VehicleLocationCreate(VehicleLocationBase):
    fk_id_veiculo_ocupado: Optional[int]

class VehicleLocation(VehicleLocationBase):
    id: int

    class Config:
        orm_mode = True


# Esquemas para a entidade Route (Rota)
class RouteBase(BaseModel):
    origem: str  # Ajustado para string
    destino: str  # Ajustado para string
    distancia_km: float
    tempo_estimado: int

class RouteCreate(RouteBase):
    fk_id_entrega: int  # Não opcional para criar uma rota

class Route(RouteBase):
    id: int
    fk_id_entrega: Optional[int]

    class Config:
        orm_mode = True


# Esquemas para a entidade Delivery (Entrega)
class DeliveryBase(BaseModel):
    status: str = "pending"
    is_delivered: bool = False

class DeliveryCreate(DeliveryBase):
    fk_id_veiculo: int
    fk_id_produto: int
    fk_id_ponto_entrega: int

class Delivery(DeliveryBase):
    id: int
    vehicle: Optional["Vehicle"] = None  # Associações explícitas
    route: Optional["Route"] = None

    class Config:
        orm_mode = True
        

class ProductInDelivery(BaseModel):
    product_id: int
    quantity: int

class DeliveryCreate(BaseModel):
    origin_lat: float  
    origin_lon: float  
    products: List[ProductInDelivery]  
    
class DeliveryResponse(BaseModel):
    id: int
    status: str
    fk_id_veiculo: Optional[int]
    total_capacity_needed: int
    vehicle: Optional["Vehicle"]

    class Config:
        orm_mode = True


# Esquemas para a entidade Employee (Funcionario)
class EmployeeBase(BaseModel):
    nome: str
    end_rua: str
    end_bairro: str
    end_numero: int
    telefone: int
    area: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    fk_id_usuario: Optional[int]

    class Config:
        orm_mode = True
        

