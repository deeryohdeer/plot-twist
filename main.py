from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

import json
from storage import loadList

import random

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.get("/filter")
async def filterpage(request: Request):
    return templates.TemplateResponse(request, "filter.html")

@app.get("/random")
async def randompage():
    fullList = loadList()
    randomResult = random.sample(fullList,10)
    return(randomResult)

@app.get("/sync")
async def root():
    return {"message": "syncing..."}