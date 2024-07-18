from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

class TaskBase(BaseModel):
    name: str
    description: str
    status: str
    created: str

class TaskModel(TaskBase):
    id: int

    class Config:
        orm_mode: True


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.post("/tasks/", response_model=TaskModel)
async def create_task(task: TaskBase, db: db_dependency):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[TaskModel])
async def read_task(db: db_dependency, skip: int = 0, limit: int = 100):
    tasks = db.query(models.Task).offset(skip).limit(limit).all()
    return tasks

   

@app.delete("/tasks/{id}")
async def delete_task(id: int, db: db_dependency, skip: int = 0, limit: int = 100):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if task is None: raise HTTPException()
    db.query(models.Task).filter(models.Task.id == id).delete()
    db.commit()
    db.refresh()

@app.put("/tasks/{id}")
async def update_task(task: TaskBase, id: int, db: db_dependency, skip: int = 0, limit: int = 100):
    task_model = db.query(models.Task).filter(models.Task.id == id).first()       
    if task_model is None: raise HTTPException()
    task_model.name = task.name
    task_model.description = task.description
    task_model.status = task.status
    task_model.created = task.created
    db.add(task_model)
    db.commit()
    db.refresh()

