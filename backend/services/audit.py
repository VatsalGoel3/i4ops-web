from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, Session
from datetime import datetime

engine = create_engine("sqlite:///audit.db", echo=False, future=True)
Base = declarative_base()

class Audit(Base):
    __tablename__ = "audit"
    id = Column(Integer, primary_key=True)
    actor = Column(String, index=True)
    resource = Column(String)
    action = Column(String)
    diff = Column(Text)
    ts = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

def record(actor: str, resource: str, action: str, diff: str):
    with Session(engine) as s, s.begin():
        s.add(Audit(actor=actor, resource=resource, action=action, diff=diff))