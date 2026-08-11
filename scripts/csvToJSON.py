import pandas as pd

#Read CSV file
df = pd.read_csv('activities_database.csv')

# DataFrame to JSON
df.to_json('output.json', orient='records', lines=False)