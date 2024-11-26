import pytest
from datetime import datetime
from models import (
    User, Client, Product, Driver, DistributionPoint, VehicleLocation, Route, Delivery, Employee
)


# Testes para o model User
def test_create_user():
    user = User(
        id=1,
        is_client=True,
        is_driver=False,
        is_employee=False,
        email="test@example.com",
        password_hash="hashed_password",
        salt="salt_value"
    )
    assert user.email == "test@example.com"
    assert user.is_client is True
    assert user.is_employee is False


# Testes para o model Client
def test_create_client():
    client = Client(
        id=1,
        nome="Cliente 1",
        end_rua="Rua A",
        end_bairro="Bairro B",
        end_numero=123,
        telefone=987654321,
        fk_id_usuario=1
    )
    assert client.nome == "Cliente 1"
    assert client.telefone == 987654321
    assert client.fk_id_usuario == 1


# Testes para o model Product
def test_create_product():
    product = Product(
        id=1,
        nome="Produto X",
        descricao="Descrição do Produto X",
        preco=100,
        quantidade_estoque=50,
        fk_id_cliente=1
    )
    assert product.nome == "Produto X"
    assert product.preco == 100
    assert product.quantidade_estoque == 50


# Testes para o model Driver
def test_create_driver():
    driver = Driver(
        id=1,
        nome="Motorista A",
        habilitacao="AB123456",
        telefone=999888777,
        end_rua="Rua Motorista",
        end_bairro="Bairro Motorista",
        end_numero=45,
        fk_id_usuario=1,
        fk_id_veiculo=2
    )
    assert driver.nome == "Motorista A"
    assert driver.habilitacao == "AB123456"
    assert driver.fk_id_veiculo == 2


# Testes para o model DistributionPoint
def test_create_distribution_point():
    point = DistributionPoint(
        id=1,
        nome="Ponto A",
        end_rua="Rua Ponto",
        end_bairro="Bairro Ponto",
        end_numero=123,
        tipo="Centro de Distribuição"
    )
    assert point.nome == "Ponto A"
    assert point.tipo == "Centro de Distribuição"


# Testes para o model VehicleLocation
def test_create_vehicle_location():
    location = VehicleLocation(
        id=1,
        latitude=-23.561684,
        longitude=-46.625378,
        data_hora=datetime(2024, 11, 26, 10, 0, 0)
    )
    assert location.latitude == -23.561684
    assert location.longitude == -46.625378


# Testes para o model Route
def test_create_route():
    route = Route(
        id=1,
        origem="Local A",
        destino="Local B",
        distancia_km=15.0,
        tempo_estimado=30,
        fk_id_entrega=2
    )
    assert route.origem == "Local A"
    assert route.destino == "Local B"
    assert route.distancia_km == 15.0


# Testes para o model Delivery
def test_create_delivery():
    delivery = Delivery(
        id=1,
        fk_id_veiculo=1,
        fk_id_produto=2,
        fk_id_ponto_entrega=3,
        status="pending",
        is_delivered=False,
        data_criacao=datetime(2024, 11, 26, 12, 0, 0),
        data_entrega=None
    )
    assert delivery.status == "pending"
    assert delivery.is_delivered is False


# Testes para o model Employee
def test_create_employee():
    employee = Employee(
        id=1,
        nome="Funcionário 1",
        end_rua="Rua Funcionário",
        end_bairro="Bairro Funcionário",
        end_numero=12,
        telefone=123456789,
        area="Logística",
        fk_id_usuario=1
    )
    assert employee.nome == "Funcionário 1"
    assert employee.area == "Logística"
    assert employee.telefone == 123456789
