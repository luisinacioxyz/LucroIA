from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///data.db")
Base = declarative_base()

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    produto = Column(String, index=True)
    preco = Column(Float)
    quantidade = Column(Integer)
    custo = Column(Float)
    data = Column(String)  # Formato: "YYYY-MM-DD"
    id_produto = Column(String)
    id_compra = Column(String)
    id_cliente = Column(String)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine) 