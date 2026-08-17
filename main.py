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

@app.get("/random")
async def randompage(request: Request):
    fullList = loadList()
    randomResult = random.sample(fullList,10)
    return templates.TemplateResponse(request, "results.html", {"activities":randomResult})

@app.get("/filter")
async def filterpage(request: Request):
    return templates.TemplateResponse(request, "filter.html")

@app.get("/results")
async def results():
    return {"message": "hooray!"}

@app.get("/sync")
async def root():
    return {"message": "syncing..."}