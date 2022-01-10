from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm.session import sessionmaker

# SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://USER:PASSWORD@HOST:PORT/DB"
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:password@localhost/lab4"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_all():    
    Base.metadata.create_all(bind=engine)

def drop_all():
    Base.metadata.drop_all(bind=engine)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
