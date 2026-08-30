import pandas as pd

#Read CSV file
df = pd.read_csv('activities_database.csv')

# Create ID based on row number
df['id'] = [
    f"{i:06d}" for i in range(1, len(df) + 1)
]

# DataFrame to JSON
df.to_json('output.json', orient='records', lines=False)