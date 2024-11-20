from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)

async_sessionmaker = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db():
    async with async_sessionmaker() as session:
        try:
            yield session
        finally:
            await session.close()
