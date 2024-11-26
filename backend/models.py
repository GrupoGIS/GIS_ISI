from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "Usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    is_client = Column(Boolean)
    is_driver = Column(Boolean)
    is_employee = Column(Boolean)
    email = Column(String)
    password_hash = Column(String)
    salt = Column(String)

    clients = relationship("Client", back_populates="user")
    drivers = relationship("Driver", back_populates="user")
    employees = relationship("Employee", back_populates="user")

class Client(Base):
    __tablename__ = "Cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    telefone = Column(Integer)
    fk_id_usuario = Column(Integer, ForeignKey("Usuario.id"))

    user = relationship("User", back_populates="clients")
    products = relationship("Product", back_populates="client")

class Product(Base):
    __tablename__ = "Produto"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String)
    preco = Column(Integer)
    quantidade_estoque = Column(Integer)
    fk_id_cliente = Column(Integer, ForeignKey("Cliente.id"))

    client = relationship("Client", back_populates="products")
    deliveries = relationship("Delivery", back_populates="product")
    distribution_points = relationship("DistributionPoint", back_populates="product")  # Relacionamento reverso

    
class Vehicle(Base):
    __tablename__ = "Veiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)
    modelo = Column(String)
    capacidade = Column(Integer)
    fk_id_localizacao = Column(Integer, ForeignKey("LocalizacaoVeiculo.id"))
    is_available = Column(Boolean, default=True)

    drivers = relationship("Driver", back_populates="vehicle")
    location = relationship("VehicleLocation", back_populates="vehicle", foreign_keys=[fk_id_localizacao], remote_side="VehicleLocation.id")
    deliveries = relationship("Delivery", back_populates="vehicle")
    
class Driver(Base):
    __tablename__ = "Motorista"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    habilitacao = Column(String)
    telefone = Column(Integer)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    fk_id_usuario = Column(Integer, ForeignKey("Usuario.id"))
    fk_id_veiculo = Column(Integer, ForeignKey("Veiculo.id"))
    
    user = relationship("User", back_populates="drivers")
    vehicle = relationship("Vehicle", back_populates="drivers")

class DistributionPoint(Base):
    __tablename__ = "PontoDistribuicao"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    tipo = Column(String)
    fk_id_produto = Column(Integer, ForeignKey("Produto.id"))  

    product = relationship("Product", back_populates="distribution_points")
    
class VehicleLocation(Base):
    __tablename__ = "LocalizacaoVeiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    data_hora = Column(Date)
    
    vehicle = relationship("Vehicle", back_populates="location", uselist=False)

class Route(Base):
    __tablename__ = "Rota"
    
    id = Column(Integer, primary_key=True, index=True)
    distancia_km = Column(Float)
    tempo_estimado = Column(Integer)  
    fk_id_entrega = Column(Integer, ForeignKey("Entrega.id"))

    delivery = relationship("Delivery", back_populates="route")
    
class Delivery(Base):
    __tablename__ = "entregas"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo = Column(Integer, ForeignKey("veiculos.id"))
    fk_id_produto = Column(Integer, ForeignKey("produtos.id"))
    fk_id_ponto_entrega = Column(Integer, ForeignKey("pontos_distribuicao.id"))
    status = Column(String, default="pending")  # Exemplo: "pending", "in_progress", "delivered"
    is_delivered = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)  # Data de criação da entrega
    data_entrega = Column(DateTime, nullable=True)  # Data de entrega
    
    # Relacionamentos com outras tabelas
    vehicle = relationship("Vehicle", back_populates="deliveries")
    product = relationship("Product", back_populates="deliveries")
    distribution_point = relationship("DistributionPoint", back_populates="deliveries")
    client = relationship("Client", back_populates="deliveries")
    
    # Relacionamento com a tabela Report
    reports = relationship("Report", back_populates="delivery")

class Employee(Base):
    __tablename__ = "Funcionario"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    telefone = Column(Integer)
    area = Column(String)
    fk_id_usuario = Column(Integer, ForeignKey("Usuario.id"))

    user = relationship("User", back_populates="employees")

class VehicleLocation(Base):
    __tablename__ = "VehicleLocation"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)

    vehicle = relationship("Vehicle", back_populates="location")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    tempo_tomado = Column(Float, nullable=False)  # Tempo real que foi tomado para a entrega (em horas ou minutos)
    tempo_estimado = Column(Float, nullable=False)  # Tempo estimado para a entrega (em horas ou minutos)
    diferenca = Column(Float)  # Diferença entre tempo estimado e tempo tomado
    is_warning = Column(Boolean, default=False)  # Flag para indicar se houve um problema com o tempo
    delivery_id = Column(Integer, ForeignKey("entregas.id"), nullable=False)  # Chave estrangeira para a entrega

    # Relacionamento com a tabela Delivery
    delivery = relationship("Delivery", back_populates="reports")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    
class ReportResponse(BaseModel):
    id: int
    tempo_tomado: float
    tempo_estimado: float
    diferenca: float
    is_warning: bool
    delivery_id: int

    class Config:
        orm_mode = True