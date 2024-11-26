from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Delivery, Vehicle, Product
from backend.schemas import DeliveryCreate, DeliveryResponse
from geopy.distance import geodesic
from datetime import datetime

router = APIRouter()


@router.post("/create_delivery", response_model=DeliveryResponse)
async def create_delivery(delivery_data: DeliveryCreate, db: Session = Depends(get_db)):
    # 1. Calcular a capacidade total necessária para a entrega
    total_capacity_needed = sum([product.quantity for product in delivery_data.products])

    # 2. Buscar veículos disponíveis
    available_vehicles = db.query(Vehicle).filter(Vehicle.is_available == True).all()

    if not available_vehicles:
        raise HTTPException(status_code=404, detail="Nenhum veículo disponível")

    best_vehicle = None
    min_distance = float('inf')

    # 3. Verificar a disponibilidade de veículos e calcular a distância
    for vehicle in available_vehicles:
        if vehicle.capacidade >= total_capacity_needed:
            # Calcular a distância usando a localização do veículo
            vehicle_location = (vehicle.location.latitude, vehicle.location.longitude)
            origin_location = (delivery_data.origin_lat, delivery_data.origin_lon)

            # Calcular a distância
            vehicle_distance = geodesic(vehicle_location, origin_location).kilometers

            # Verificar se o veículo é o mais próximo
            if vehicle_distance < min_distance:
                best_vehicle = vehicle
                min_distance = vehicle_distance

    # Se não houver veículos com capacidade suficiente
    if not best_vehicle:
        raise HTTPException(status_code=400, detail="Nenhum veículo com capacidade suficiente encontrado")

    # 4. Criar a entrega com fk_id_veiculo inicialmente como None
    new_delivery = Delivery(
        status="Em processo", 
        total_capacity_needed=total_capacity_needed,
        fk_id_veiculo=None  # Inicialmente sem veículo
    )

    db.add(new_delivery)
    db.commit()
    db.refresh(new_delivery)

    # 5. Atualizar a entrega com o veículo mais próximo
    best_vehicle.is_available = False  # Marca o veículo como não disponível
    new_delivery.fk_id_veiculo = best_vehicle.id  # Associa o veículo à entrega
    db.commit()

    # Retorna a resposta da entrega
    return DeliveryResponse(
        id=new_delivery.id, 
        status=new_delivery.status, 
        fk_id_veiculo=best_vehicle.id, 
        total_capacity_needed=total_capacity_needed, 
        vehicle=best_vehicle
    )



@router.put("/update_delivery/{delivery_id}", response_model=DeliveryResponse)
async def update_delivery_status(delivery_id: int, status: str, db: Session = Depends(get_db)):
    # Buscar a entrega no banco
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    
    if not delivery:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")

    # Atualizar o status
    delivery.status = status
    
    # Se o status for "delivered", atualizar a data_entrega
    if status == "delivered" and not delivery.data_entrega:
        delivery.data_entrega = datetime.utcnow()  # Preenche a data de entrega com a hora atual
    
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

