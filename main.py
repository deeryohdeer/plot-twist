from fastapi import FastAPI, Request, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import PlainTextResponse

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

VALID_DAYS = {"Any", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
VALID_NUM_PPL = {"Any", "Just myself", "Two people", "Small group", "Big group"}
VALID_INDOOR_OUTDOOR = {"Any", "Indoor", "Outdoor"}
VALID_BUDGET = {"Any", "Free", "$", "$$", "$$$"}
VALID_EFFORT_LEVEL = {"Any", "Low", "Medium", "High"}
VALID_REGION = {
    "Any", "Sydney CBD", "Inner West", "Eastern Suburbs", "North Shore",
    "Northern Beaches", "South Sydney", "Western Sydney", "Blue Mountains",
    "Central Coast", "Hunter/Newcastle", "Southern Highlands", "South Coast",
    "NSW - Other",
}


@app.exception_handler(StarletteHTTPException)
async def not_found_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return templates.TemplateResponse(request, "404.html", status_code=404)
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code, headers=exc.headers)


@app.exception_handler(RequestValidationError)
async def invalid_params_handler(request: Request, exc: RequestValidationError):
    return templates.TemplateResponse(request, "404.html", status_code=404)

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

    if (
        day not in VALID_DAYS
        or numPpl not in VALID_NUM_PPL
        or indoorOutdoor not in VALID_INDOOR_OUTDOOR
        or budget not in VALID_BUDGET
        or effortLevel not in VALID_EFFORT_LEVEL
        or region not in VALID_REGION
    ):
        return templates.TemplateResponse(request, "404.html", status_code=404)

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

        budget_levels = {"Free": 0, "$": 1, "$$": 2, "$$$": 3}
        filterBudget = [entry for entry in filterDay if budget=="Any" or budget_levels[entry["budget"]] <= budget_levels[budget]]


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
        return templates.TemplateResponse(request, "404.html", status_code=404)

@app.get("/sync")
async def root():
    return {"message": "syncing..."}