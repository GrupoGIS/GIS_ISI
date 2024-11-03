from fastapi import FastAPI
from app import views  # Importa as rotas definidas na aplicação

app = FastAPI()

# Inclui as rotas
app.include_router(views.router)

@app.get("/health")
async def health_check():
    return {"status": "UP"}  # Checagem de saúde simples

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
