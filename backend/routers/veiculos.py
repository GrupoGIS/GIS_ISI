from geopy.distance import geodesic
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import Delivery, Vehicle, DistributionPoint
from backend.schemas import DeliveryResponse

router = APIRouter()

# Raio de proximidade em metros (por exemplo, 100 metros)
PROXIMITY_RADIUS_METERS = 100

@router.put("/check_vehicle_proximity/{delivery_id}", response_model=DeliveryResponse)
async def check_vehicle_proximity(delivery_id: int, db: Session = Depends(get_db)):
    # Buscar a entrega no banco
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()

    if not delivery:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")

    # Buscar o ponto de entrega relacionado
    distribution_point = db.query(DistributionPoint).filter(DistributionPoint.id == delivery.fk_id_ponto_entrega).first()

    if not distribution_point:
        raise HTTPException(status_code=404, detail="Ponto de entrega não encontrado")

    # Verificar se a entrega já está em andamento
    if delivery.status == "in_progress":
        raise HTTPException(status_code=400, detail="Entrega já está em andamento")

    # Buscar o veículo relacionado à entrega
    vehicle = db.query(Vehicle).filter(Vehicle.id == delivery.fk_id_veiculo).first()

    if not vehicle or not vehicle.location:
        raise HTTPException(status_code=404, detail="Veículo ou localização do veículo não encontrados")

    # Calcular a distância entre a localização do veículo e o ponto de entrega
    vehicle_location = (vehicle.location.latitude, vehicle.location.longitude)
    delivery_location = (distribution_point.latitude, distribution_point.longitude)

    # Calcular a distância em metros
    distance = geodesic(vehicle_location, delivery_location).meters

    # Se o veículo estiver dentro do raio de proximidade, atualize o status da entrega
    if distance <= PROXIMITY_RADIUS_METERS:
        # Atualiza o status da entrega para "Em andamento"
        delivery.status = "in_progress"
        db.commit()
        db.refresh(delivery)

        return DeliveryResponse(
            id=delivery.id,
            status=delivery.status,
            fk_id_veiculo=delivery.fk_id_veiculo,
            fk_id_produto=delivery.fk_id_produto,
            fk_id_ponto_entrega=delivery.fk_id_ponto_entrega,
            data_criacao=delivery.data_criacao,
            data_entrega=delivery.data_entrega
        )
    else:
        raise HTTPException(status_code=400, detail="Veículo não está dentro do raio de proximidade")

