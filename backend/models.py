# Modelos de dados (SQLAlchemy)
from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "Usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    is_client = Column(Boolean)
    is_driver = Column(Boolean)
    is_employee = Column(Boolean)
    email = Column(String)
    password_hash = Column(String)
    salt = Column(String)

    clients = relationship("Cliente", back_populates="Usuario")
    drivers = relationship("Motorista", back_populates="Usuario")
    employees = relationship("Funcionario", back_populates="Usuario")

class Client(Base):
    __tablename__ = "Cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    telefone = Column(Integer)
    fk_id_usuario = Column(Integer, ForeignKey("Usuario.id"))

    user = relationship("Usuario", back_populates="Cliente")
    products = relationship("Produto", back_populates="Cliente")

class Product(Base):
    __tablename__ = "Produto"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String)
    preco = Column(Integer)
    quantidade_estoque = Column(Integer)
    fk_id_cliente = Column(Integer, ForeignKey("Cliente.id"))

    client = relationship("Cliente", back_populates="Produto")
    deliveries = relationship("Entrega", back_populates="Produto")
    
class Vehicle(Base):
    __tablename__ = "Veiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)
    modelo = Column(String)
    capacidade = Column(Integer)
    fk_id_localizacao = Column(Integer, ForeignKey("LocalizacaoVeiculo.id"))
    is_available = Column(Boolean, default=True)

    drivers = relationship("Motorista", back_populates="Veiculo")
    location = relationship("LocalizacaoVeiculo", back_populates="Veiculo")
    deliveries = relationship("Entrega", back_populates="Veiculo")
    
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
    
    user = relationship("Usuario", back_populates="Motorista")
    vehicle = relationship("Veiculo", back_populates="Motorista")

class DistributionPoint(Base):
    __tablename__ = "PontoDistribuicao"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    tipo = Column(String)

    deliveries = relationship("Entrega", back_populates="PontoDistribuicao")
    
class VehicleLocation(Base):
    __tablename__ = "LocalizacaoVeiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo_ocupado = Column(Integer, ForeignKey("Veiculo.id"))
    latitude = Column(Float)
    longitude = Column(Float)
    data_hora = Column(Date)
    
    vehicle = relationship("Veiculo", back_populates="LocalizacaoVeiculo")

class Route(Base):
    __tablename__ = "Rota"
    
    id = Column(Integer, primary_key=True, index=True)
    origem = Column(Float)
    destino = Column(Float)
    distancia_km = Column(Float)
    tempo_estimado = Column(Integer)  
    fk_id_entrega = Column(Integer, ForeignKey("Entrega.id"))

    delivery = relationship("Entrega", back_populates="Rota")
    
class Delivery(Base):
    __tablename__ = "Entrega"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo = Column(Integer, ForeignKey("Veiculo.id"))
    fk_id_produto = Column(Integer, ForeignKey("Produto.id"))
    fk_id_ponto_entrega = Column(Integer, ForeignKey("PontoDistribuicao.id"))
    status = Column(String, default="pending")  # Exemplo: "pending", "in_progress", "delivered"
    fk_id_ponto_entrega = Column(Integer, ForeignKey("PontoDistribuicao.id"))
    is_delivered = Column(Boolean, default="False")
    
    vehicle = relationship("Veiculo", back_populates="Entrega")
    product = relationship("Produto", back_populates="Entrega")
    distribution_point = relationship("PontoDistribuicao", back_populates="Entrega")
    route = relationship("Rota", back_populates="Entrega")


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

    user = relationship("Usuario", back_populates="Funcionario")
