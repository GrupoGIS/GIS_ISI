# Modelos de dados (SQLAlchemy)
from sqlalchemy import Column, Integer, String
from .database import Base

class Client(Base):
    __tablename__ = "Cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    telefone = Column(Integer)
    fk_id_usuario = Column(Integer, foreign_key= "Usuario.id")

    user = relationship("Usuario", back_populates="Clientes")

class Product(Base):
    __tablename__ = "Produto"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String)
    preco = Column(Integer)
    quantidade_estoque = Column(Integer)
    fk_id_cliente = Column(Integer, foreign_key = "Cliente.id")

    product = relationship("Cliente", back_populates="Produto")

    
class Vehicle(Base):
    __tablename__ = "Veiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)
    modelo = Column(String)
    capacidade = Column(Integer)
    is_available = Column(Boolean, default=True)

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
    fk_id_usuario = Column(Integer, foreign_key= "Usuario.id")
    
    # Relacionamento com entregas
    deliveries = relationship("Entrega", back_populates="Motorista")
    driver = relationship("Usuario", back_populates="Motorista")


class DistributionPoint(Base):
    __tablename__ = "PontoDistribuicao"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    tipo = Column(String)

    distpoint = relationship("Entrega", back_populates="PontoDistribuicao") 

    
class VehicleLocation(Base):
    __tablename__ = "Localizacao_Veiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo_ocupado = Column(Integer, ForeignKey="Contrato.id")
    latitude = Column(Float)
    longitude = Column(Float)
    data_hora = Column(Date)
    

class Route(Base):
    __tablename__ = "Rota"
    
    id = Column(Integer, primary_key=True, index=True)
    origem = Column(Float)
    destino = Column(Float)
    distancia_km = Column(Float)
    tempo_estimado = Column(Integer)  
    fk_id_entrega = Column(Integer, ForeignKey="Entrega.id")
    

class Delivery(Base):
    __tablename__ = "Entrega"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo_ocupado = Column(Integer, ForeignKey="Contrato.id")
    fk_id_produto = Column(Integer, ForeignKey="Produto.id")
    fk_id_ponto_entrega = Column(Integer, ForeignKey="PontoDistribuicao.id")
    status = Column(String, default="pending")  # Exemplo: "pending", "in_progress", "delivered"
    
    # Relacionamentos
    vehicle = relationship("Vehicle", back_populates="deliveries")
    driver = relationship("Driver", back_populates="deliveries")
    product = relationship("Product")
    distribution_point = relationship("DistributionPoint")
    route = relationship("Route")