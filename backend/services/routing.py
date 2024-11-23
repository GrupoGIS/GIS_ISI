import requests

# Configurar a chave da API do Google
GOOGLE_MAPS_API_KEY = "SUA_CHAVE_DE_API"

async def get_google_route(origin: str, destination: str):

    base_url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "key": GOOGLE_MAPS_API_KEY,
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            route = data["routes"][0]
            return {
                "distance": route["legs"][0]["distance"]["value"],  # Em metros
                "duration": route["legs"][0]["duration"]["value"],  # Em segundos
                "steps": route["legs"][0]["steps"],  # Detalhes da rota
            }
        else:
            raise Exception(f"Erro da API do Google: {data['status']}")
    else:
        raise Exception(f"Falha ao consultar a API do Google Maps: {response.status_code}")
