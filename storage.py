import json

FILENAME = "data/output.json"

def loadList():
    try:
        with open(FILENAME,"r") as file:
            return json.load(file)
    except:
        return []