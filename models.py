class Activity:
    def __init__(self, activity, numberOfPeople, indoorOrOutdoor, budget, effortLevel, region):
        self.activity = activity
        self.numberOfPeople = numberOfPeople
        self.indoorOrOutdoor = indoorOrOutdoor
        self.budget = budget
        self.effortLevel = effortLevel
        self.region = region

    def todictionary(self):
        return {
            "activity": self.activity,
            "numberOfPeople": self.numberOfPeople,
            "indoorOrOutdoor": self.indoorOrOutdoor,
            "budget": self.budget,
            "effortLevel": self.effortLevel,
            "region": self.region
        }