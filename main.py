from fastapi import FastAPI, Request, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse

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

@app.get("/sw.js")
async def service_worker():
    return FileResponse("static/sw.js", media_type="application/javascript")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/icons/favicon.ico", media_type="image/x-icon")

@app.get("/filter")
async def filterpage(request: Request):
    return templates.TemplateResponse(request, "filter.html")

@app.get("/results")
async def read_results(request: Request, day, numPpl, indoorOutdoor, budget, effortLevel, region, isRandom: bool=False, page: int=Query(1,ge=1), seed: int|None=None):

    if seed is None:
        seed = random.randint(1,1_000_000)
    rng = random.Random(seed)

    fullList = loadList()

    pageSize = 10
    start = (page - 1)*pageSize
    end = start + pageSize

    if not isRandom:
        filterNumPpl = [entry for entry in fullList if numPpl=="Any" or entry["numberOfPeople"] in (numPpl, "Any")]
        filterIndoorOutdoor = [entry for entry in filterNumPpl if indoorOutdoor=="Any" or entry['indoorOrOutdoor']==indoorOutdoor]   
        filterDay = [entry for entry in filterIndoorOutdoor if day=="Any" or entry.get(day)==1]
        filterBudget = [entry for entry in filterDay if budget=="Any" or entry['budget']==budget]
        filterEffortLevel = [entry for entry in filterBudget if effortLevel=="Any" or entry['effortLevel']==effortLevel]
        filterRegion = [entry for entry in filterEffortLevel if region=="Any" or entry['region']==region]

        finalFilteredRange = filterRegion
    else: 
        finalFilteredRange = fullList

    
    rng.shuffle(finalFilteredRange)

    return templates.TemplateResponse(request, "results.html", context={
        "results": finalFilteredRange[start:end],
        "page": page,
        "seed": seed,
        "isRandom": isRandom,
        "has_next": end < len(finalFilteredRange),
        "day": day,
        "numPpl": numPpl, 
        "indoorOutdoor": indoorOutdoor, 
        "budget": budget, 
        "effortLevel": effortLevel, 
        "region": region
    })

@app.get("/activities/{id}")
async def getActivity(request: Request, id:str):
    fullList = loadList()

    filterActivity = [entry for entry in fullList if entry["id"]==id]
    if len(filterActivity) > 0:
        return templates.TemplateResponse(request, "getactivity.html", {"activities":filterActivity})
    else:
        return templates.TemplateResponse(request, "404.html")

@app.get("/sync")
async def root():
    return {"message": "syncing..."}