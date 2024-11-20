# Modelos de dados (SQLAlchemy)
from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "Usuario"
    
    id = Column(Integer, primary_key=True, index=True)
    is_client = Column(Boolean)
    is_driver = Column(Boolean)
    is_employee = Column(Boolean)
    email = Column(String)
    password_hash = Column(String)
    salt = Column(String)


class Client(Base):
    __tablename__ = "Cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    telefone = Column(Integer)
    fk_id_usuario = Column(Integer, ForeignKey("Usuario.id"))


class Product(Base):
    __tablename__ = "Produto"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String)
    preco = Column(Integer)
    quantidade_estoque = Column(Integer)
    fk_id_cliente = Column(Integer, ForeignKey("Cliente.id"))


    
class Vehicle(Base):
    __tablename__ = "Veiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)
    modelo = Column(String)
    capacidade = Column(Integer)
    fk_id_localizacao = Column(Integer, ForeignKey("LocalizacaoVeiculo.id"))
    is_available = Column(Boolean, default=True)

    
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
    

class DistributionPoint(Base):
    __tablename__ = "PontoDistribuicao"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    end_rua = Column(String)
    end_bairro = Column(String)
    end_numero = Column(Integer)
    tipo = Column(String)


    
class VehicleLocation(Base):
    __tablename__ = "LocalizacaoVeiculo"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo_ocupado = Column(Integer, ForeignKey("Veiculo.id"))
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
    fk_id_entrega = Column(Integer, ForeignKey("Entrega.id"))

    
class Delivery(Base):
    __tablename__ = "Entrega"
    
    id = Column(Integer, primary_key=True, index=True)
    fk_id_veiculo = Column(Integer, ForeignKey("Veiculo.id"))
    fk_id_produto = Column(Integer, ForeignKey("Produto.id"))
    fk_id_ponto_entrega = Column(Integer, ForeignKey("PontoDistribuicao.id"))
    status = Column(String, default="pending")  # Exemplo: "pending", "in_progress", "delivered"
    fk_id_ponto_entrega = Column(Integer, ForeignKey("PontoDistribuicao.id"))
    is_delivered = Column(Boolean, default="False")
    


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


