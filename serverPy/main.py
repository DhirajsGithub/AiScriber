from fastapi import FastAPI
from typing import Optional

app = FastAPI()


@app.get("/")
def index():
    return {"msg": "Welcome to ai scrapper"}


@app.post("/audio/{name}")
def index(name):
    return {"msg": f"audio name is {name}"}
