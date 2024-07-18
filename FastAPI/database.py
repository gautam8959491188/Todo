from sqlalchemy import Column, Integer, String,DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

db_url = "sqlite:///database.db"
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
