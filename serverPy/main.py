

from fastapi import FastAPI
from typing import Optional
from chatGptAPI import chat
from pydantic import BaseModel
import convertToText
from fastapi.middleware.cors import CORSMiddleware

import objectDetection.objDetect

app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Data (BaseModel):
    subtitle: str


@app.get("/")
def index():
    return {"msg": "Welcome to ai scrapper"}


@app.get("/objDet")
def index():
    return {"objDetect": objectDetection.objDetect.objDet()}


@app.get("/audioToText")
def index():
    return {"subtitle": convertToText.getText()}


@app.post("/summary")
def index(Data: Data):
    return {f"{chat.getSummary(Data.subtitle)}"}


@app.post("/audio/{name}")
def index(name):
    return {"msg": f"audio name is {name}"}
