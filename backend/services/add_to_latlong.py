from geopy.geocoders import Nominatim
from geopy.exc import GeopyError

# Função para obter latitude e longitude
def get_lat_long_from_address(rua: str, bairro: str, numero: int) -> tuple[float, float]:
    """
    Obtém latitude e longitude de um endereço.

    :param rua: Nome da rua.
    :param bairro: Nome do bairro.
    :param numero: Número da casa/estabelecimento.
    :return: Uma tupla (latitude, longitude).
    :raises ValueError: Se não for possível encontrar as coordenadas.
    """
    geolocator = Nominatim(user_agent="delivery_service")
    full_address = f"{rua}, {numero}, {bairro}"
    
    try:
        location = geolocator.geocode(full_address)
        if location:
            return location.latitude, location.longitude
        else:
            raise ValueError(f"Endereço não encontrado: {full_address}")
    except GeopyError as e:
        raise ValueError(f"Erro ao tentar geocodificar o endereço: {e}")
