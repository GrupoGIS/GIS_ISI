from geopy.distance import geodesic
from datetime import datetime
from backend.models import Report
from backend.schemas import ReportResponse
from sqlalchemy.orm import Session
from backend.models import Delivery, Vehicle, Product, DistributionPoint
from fastapi import HTTPException


def generate_report(delivery: Delivery, db: Session) -> ReportResponse:
    """
    Gera um relatório com base nos dados da entrega.
    """
    # Buscar as tabelas relacionadas
    vehicle = db.query(Vehicle).filter(Vehicle.id == delivery.fk_id_veiculo).first()
    product = db.query(Product).filter(Product.id == delivery.fk_id_produto).first()
    distribution_point = db.query(DistributionPoint).filter(DistributionPoint.id == delivery.fk_id_ponto_entrega).first()

    if not (vehicle and product and distribution_point):
        raise HTTPException(status_code=404, detail="Dados relacionados não encontrados para gerar o relatório")

    # Calcular tempo de entrega
    time_taken = (delivery.data_entrega - delivery.data_criacao).total_seconds() / 3600  # Em horas

    # Calcular quilometragem (origem -> destino)
    origin_location = (vehicle.location.latitude, vehicle.location.longitude)
    destination_location = (distribution_point.latitude, distribution_point.longitude)
    kilometers = geodesic(origin_location, destination_location).kilometers

    # Quantidade de produtos
    total_products = product.quantidade

    # Criar entrada no banco para o relatório
    new_report = Report(
        delivery_id=delivery.id,
        vehicle_id=vehicle.id,
        time_taken=time_taken,
        kilometers=kilometers,
        total_products=total_products
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Retornar os dados do relatório
    return ReportResponse(
        report_id=new_report.id,
        delivery_id=delivery.id,
        vehicle_id=vehicle.id,
        time_taken=time_taken,
        kilometers=kilometers,
        total_products=total_products
    )
