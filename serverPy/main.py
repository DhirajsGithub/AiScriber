from fastapi import FastAPI
from typing import Optional
from chatGptAPI import chat
from pydantic import BaseModel
import convertToText

app = FastAPI()


class Data (BaseModel):
    subtitle: str


@app.get("/")
def index():
    return {"msg": "Welcome to ai scrapper"}


@app.get("/summary")
def index():

    return {f"{chat.getSummary(convertToText.getText())}"}


@app.post("/audio/{name}")
def index(name):
    return {"msg": f"audio name is {name}"}
