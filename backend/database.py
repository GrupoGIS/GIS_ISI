from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.sql import text


DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)

async_sessionmaker = sessionmaker(
    bind=engine,
    expire_on_commit=False,
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

async def drop_delivery_table(engine: AsyncEngine):
    try:
        # Drop apenas a tabela Delivery
        async with engine.begin() as conn:
            await conn.execute(text("DROP TABLE IF EXISTS \"Entrega\" CASCADE"))
            # Substitua "Entrega" pelo nome exato da tabela no banco, respeitando o case sensitivity.
    except Exception as e:
        print(f"Error dropping Delivery table: {e}")
        raise