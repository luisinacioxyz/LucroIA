from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///data.db")
Base = declarative_base()

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True)
    produto = Column(String)
    preco = Column(Float)
    quantidade = Column(Integer)
    custo = Column(Float)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine) 