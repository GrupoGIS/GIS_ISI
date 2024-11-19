from fastapi import FastAPI
from database import engine, Base
from routers import clients
from sqlalchemy.orm import Session
from services.database import SessionLocal

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(clients.router)

@app.get("/")
async def root():
    return {"message": "Backend is running!"}


@app.get("/healthcheck")
async def healthcheck():
    try:
        db: Session = SessionLocal()
        db.execute("SELECT 1")  
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)