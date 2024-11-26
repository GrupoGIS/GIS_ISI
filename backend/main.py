from fastapi import FastAPI
from sqlalchemy.sql import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import engine, Base, async_sessionmaker, get_db
from routers import auth, products, clients, distribution, veiculos, driver
from models import User
from crud import create_user
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def create_admin_user():
    async for db in get_db():  
        result = await db.execute(select(User).where(User.email == "admin@admin.com"))
        existing_user = result.scalars().first()
        
        if not existing_user:  # Evita criar duplicados
            await create_user(
                db=db,
                email="admin@admin.com",
                password="123",
                is_employee=True  
            )
            print("Usuário administrador criado: admin@admin.com")
        else:
            print("Usuário administrador já existe.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(products.router, tags=["Products"])
app.include_router(clients.router, tags=["Clients"])
# app.include_router(distribution.router, prefix="/distribution", tags=["Distribution"])
app.include_router(veiculos.router, tags=["Veiculos"])
app.include_router(driver.router, tags=["Motorista"])

@app.on_event("startup")
async def startup_event():
    await create_tables()
    await create_admin_user()

@app.get("/")
async def root():
    return {"message": "Backend is running!"}

@app.get("/healthcheck")
async def healthcheck():
    try:
        async with async_sessionmaker() as session:
            await session.execute(text("SELECT 1"))  
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
