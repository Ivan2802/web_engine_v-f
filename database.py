from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import sessionmaker

DB_URL = 'sqlite:///./database.db'
engine = create_engine(DB_URL, connect_args={'check_same_thread': False})

class Base(DeclarativeBase): pass
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

class Site(Base):
    __tablename__ = 'sites'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    link = Column(String)
    template = Column(String)
    status = Column(String)
    user = Column(Integer)

LocalSession = sessionmaker(autoflush=False, bind=engine)