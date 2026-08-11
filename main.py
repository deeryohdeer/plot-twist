from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.get("/filter")
async def filterpage():
    return {"message": "this is the filter page"}

@app.get("/random")
async def randompage():
    return {"message": "random lol xd"}

@app.get("/sync")
async def root():
    return {"message": "syncing..."}