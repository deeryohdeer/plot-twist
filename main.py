from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/filter")
async def root():
    return {"message": "this is the filter page"}

@app.get("/random")
async def root():
    return {"message": "random lol xd"}

@app.get("/sync")
async def root():
    return {"message": "syncing..."}