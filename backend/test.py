import pytest
from datetime import datetime
from backend.models import Vehicle, VehicleLocation, Delivery

# Teste de criação de um veículo
def test_create_vehicle():
    vehicle = Vehicle(
        id=1,
        placa="ABC1234",
        modelo="Caminhão",
        capacidade=5000,
        is_available=True,
        fk_id_localizacao=None,
    )
    assert vehicle.placa == "ABC1234"
    assert vehicle.capacidade == 5000
    assert vehicle.is_available is True
    assert vehicle.fk_id_localizacao is None

# Teste de criação de uma localização de veículo
def test_create_vehicle_location():
    location = VehicleLocation(
        id=1,
        latitude=-23.561684,
        longitude=-46.625378,
        data_hora=datetime(2024, 11, 26, 10, 0, 0),
    )
    assert location.latitude == -23.561684
    assert location.longitude == -46.625378
    assert location.data_hora == datetime(2024, 11, 26, 10, 0, 0)

# Teste de uma entrega com atributos básicos
def test_create_delivery():
    delivery = Delivery(
        id=1,
        fk_id_produto=2,
        fk_id_ponto_entrega=3,
        status="pending",
        is_delivered=False,
        data_criacao=datetime(2024, 11, 26, 12, 0, 0),
        data_entrega=None,
    )
    assert delivery.status == "pending"
    assert delivery.is_delivered is False
    assert delivery.data_criacao == datetime(2024, 11, 26, 12, 0, 0)
    assert delivery.data_entrega is None

# Teste de atualização de um veículo
def test_update_vehicle():
    vehicle = Vehicle(
        id=1,
        placa="ABC1234",
        modelo="Caminhão",
        capacidade=5000,
        is_available=True,
        fk_id_localizacao=None,
    )
    vehicle.is_available = False  # Atualiza disponibilidade
    assert vehicle.is_available is False

# Teste de validação de status de entrega
def test_validate_delivery_status():
    delivery = Delivery(
        id=1,
        fk_id_produto=2,
        fk_id_ponto_entrega=3,
        status="pending",
        is_delivered=False,
        data_criacao=datetime(2024, 11, 26, 12, 0, 0),
        data_entrega=None,
    )
    assert delivery.is_delivered is False
    delivery.status = "completed"
    delivery.is_delivered = True
    assert delivery.status == "completed"
    assert delivery.is_delivered is True
