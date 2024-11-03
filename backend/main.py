from fastapi import FastAPI
from routes import ahahahha

app = FastAPI()

# Inclui as rotas
app.include_router(ahahahha.router)

@app.get("/health")
async def health_check():
    return {"status": "UP"}  # Checagem de saúde simples

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

