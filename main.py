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

@app.get("/filtermore")
async def root():
    return {"message": "more filters coming"}
    
@app.get("/results")
async def read_results(request: Request, day, numPpl, indoorOutdoor):
    fullList = loadList()
    
    filterNumPpl = [entry for entry in fullList if entry['numberOfPeople'] in (numPpl, "Any")]
    filterIndoorOutdoor = [entry for entry in filterNumPpl if indoorOutdoor=="Any" or entry['indoorOrOutdoor']==indoorOutdoor]
    filterDay = [entry for entry in filterIndoorOutdoor if entry.get(day)==1]
    
    if len(filterDay) >= 10:
        randomFilteredResult = random.sample(filterDay,10)
        return templates.TemplateResponse(request, "results.html", {"activities":randomFilteredResult})
    else:
        return templates.TemplateResponse(request, "results.html", {"activities":filterDay})
   
@app.get("/sync")
async def root():
    return {"message": "syncing..."}