from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import json
from storage import loadList

import random

app = FastAPI()

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

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
async def read_results(request: Request, day, numPpl, indoorOutdoor, budget, effortLevel, region):
    fullList = loadList()
    
    filterNumPpl = [entry for entry in fullList if numPpl=="Any" or entry["numberOfPeople"] in (numPpl, "Any")]
    filterIndoorOutdoor = [entry for entry in filterNumPpl if indoorOutdoor=="Any" or entry['indoorOrOutdoor']==indoorOutdoor]   
    filterDay = [entry for entry in filterIndoorOutdoor if day=="Any" or entry.get(day)==1]
    filterBudget = [entry for entry in filterDay if budget=="Any" or entry['budget']==budget]
    filterEffortLevel = [entry for entry in filterBudget if effortLevel=="Any" or entry['effortLevel']==effortLevel]
    filterRegion = [entry for entry in filterEffortLevel if region=="Any" or entry['region']==region]

    finalFilteredRange = filterRegion
    if len(finalFilteredRange) >= 10:
        randomFilteredResult = random.sample(filterRegion,10)
        return templates.TemplateResponse(request, "results.html", {"activities":finalFilteredRange})
    else:
        return templates.TemplateResponse(request, "results.html", {"activities":finalFilteredRange})
    return []

@app.get("/sync")
async def root():
    return {"message": "syncing..."}