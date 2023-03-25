from fastapi import FastAPI
from typing import Optional
from chatGptAPI import chat
from pydantic import BaseModel
import convertToText
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
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


@app.get("/summary")
def index():

    return {f"{chat.getSummary(convertToText.getText())}"}


@app.post("/audio/{name}")
def index(name):
    return {"msg": f"audio name is {name}"}
