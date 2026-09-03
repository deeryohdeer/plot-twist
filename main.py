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
VALID_DAY_NIGHT = {"Any", "Day", "Night"}
VALID_BUDGET = {"Any", "Free", "$", "$$", "$$$"}
VALID_EFFORT_LEVEL = {"Any", "Low", "Medium", "High"}
VALID_REGION = {
    "Any", "Sydney CBD", "Inner West", "Eastern Suburbs", "North Shore",
    "Northern Beaches", "South Sydney", "Western Sydney", "Blue Mountains",
    "Central Coast", "Hunter/Newcastle", "Southern Highlands", "South Coast",
    "NSW - Other",
}
VIBE_ORDER = [
    "Sporty", "Artsy", "Groovy", "Musical", "Outdoorsy", "Relaxing",
    "Party", "Chill", "DateNight",
]
VALID_VIBES = set(VIBE_ORDER)
VIBE_LABELS = {"DateNight": "Date Night"}
VIBE_COLORS = {
    "Outdoorsy": "#599803",
    "Date Night": "#e280b1",
    "Sporty": "#012981",
    "Artsy": "#1ba8de",
    "Groovy": "#ea4414",
    "Musical": "#de8818",
    "Relaxing": "#dedbe8",
    "Party": "#8c2163",
    "Chill": "#4d615f",
}
VIBE_TEXT_COLORS = {
    "Relaxing": "#000",
}


def withVibes(entry):
    vibes = [VIBE_LABELS.get(v, v) for v in VIBE_ORDER if entry.get(v) == 1]
    return {**entry, "vibes": vibes}


def vibe_style(label):
    bg = VIBE_COLORS.get(label)
    if not bg:
        return ""
    fg = VIBE_TEXT_COLORS.get(label, "#fff")
    return f"background-color:{bg};color:{fg};"


templates.env.filters["vibe_style"] = vibe_style


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
async def read_results(request: Request, day, numPpl, indoorOutdoor, dayNight, budget, effortLevel, region, isRandom: bool=False, page: int=Query(1,ge=1), seed: int|None=None, vibe: list[str]=Query([])):

    if (
        day not in VALID_DAYS
        or numPpl not in VALID_NUM_PPL
        or indoorOutdoor not in VALID_INDOOR_OUTDOOR
        or dayNight not in VALID_DAY_NIGHT
        or budget not in VALID_BUDGET
        or effortLevel not in VALID_EFFORT_LEVEL
        or region not in VALID_REGION
        or not all(v in VALID_VIBES for v in vibe)
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
        filterDayNight = [entry for entry in filterIndoorOutdoor if dayNight=="Any" or entry['dayNight']==dayNight]
        filterDay = [entry for entry in filterDayNight if day=="Any" or entry.get(day)==1]

        budget_levels = {"Free": 0, "$": 1, "$$": 2, "$$$": 3}
        filterBudget = [entry for entry in filterDay if budget=="Any" or budget_levels[entry["budget"]] <= budget_levels[budget]]


        filterEffortLevel = [entry for entry in filterBudget if effortLevel=="Any" or entry['effortLevel']==effortLevel]
        filterRegion = [entry for entry in filterEffortLevel if region=="Any" or entry['region']==region]
        filterVibe = [entry for entry in filterRegion if not vibe or any(entry.get(v)==1 for v in vibe)]

        finalFilteredRange = filterVibe
    else: 
        finalFilteredRange = fullList

    
    rng.shuffle(finalFilteredRange)

    return templates.TemplateResponse(request, "results.html", context={
        "results": [withVibes(entry) for entry in finalFilteredRange[start:end]],
        "page": page,
        "seed": seed,
        "isRandom": isRandom,
        "has_next": end < len(finalFilteredRange),
        "day": day,
        "numPpl": numPpl,
        "indoorOutdoor": indoorOutdoor,
        "dayNight": dayNight,
        "budget": budget,
        "effortLevel": effortLevel,
        "region": region,
        "vibe": vibe,
    })

@app.get("/activities/{id}")
async def getActivity(request: Request, id:str):
    fullList = loadList()

    filterActivity = [withVibes(entry) for entry in fullList if entry["id"]==id]
    if len(filterActivity) > 0:
        return templates.TemplateResponse(request, "getactivity.html", {"activities":filterActivity})
    else:
        return templates.TemplateResponse(request, "404.html", status_code=404)

@app.get("/sync")
async def root():
    return {"message": "syncing..."}