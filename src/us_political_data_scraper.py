# us_political_data_scraper.py

import requests
import pandas as pd
from bs4 import BeautifulSoup
import json

# URLs to scrape
WIKI_URLS = {
    "senators": "https://en.wikipedia.org/wiki/List_of_current_United_States_senators",
    "house": "https://en.wikipedia.org/wiki/List_of_current_members_of_the_United_States_House_of_Representatives",
    "governors": "https://en.wikipedia.org/wiki/List_of_current_United_States_governors"
}

def scrape_table(url, table_index=0):
    res = requests.get(url)
    soup = BeautifulSoup(res.text, "html.parser")
    tables = soup.find_all("table", {"class": "wikitable"})
    df = pd.read_html(str(tables[table_index]))[0]
    return df

def parse_senators(df):
    senators = []
    for _, row in df.iterrows():
        senators.append({
            "name": row[0],
            "party": row[2] if "Democratic" in row[2] or "Republican" in row[2] else "Other",
            "state": row[1],
            "class": row[4] if len(row) > 4 else None
        })
    return senators

def parse_governors(df):
    governors = []
    for _, row in df.iterrows():
        if "State" in row[0]:
            continue  # Skip duplicate header rows
        governors.append({
            "state": row[0],
            "name": row[1],
            "party": row[2] if "Democratic" in row[2] or "Republican" in row[2] else "Other"
        })
    return governors

def main():
    # Senators
    senators_df = scrape_table(WIKI_URLS["senators"], table_index=0)
    senators = parse_senators(senators_df)

    # Governors
    governors_df = scrape_table(WIKI_URLS["governors"], table_index=0)
    governors = parse_governors(governors_df)

    # Output grouped by state
    states = {}
    for gov in governors:
        states[gov["state"]] = {"governor": gov, "senators": []}

    for senator in senators:
        state = senator["state"]
        if state in states:
            states[state]["senators"].append(senator)
        else:
            states[state] = {"governor": None, "senators": [senator]}

    # Save as JSON
    with open("state_politicians.json", "w") as f:
        json.dump(states, f, indent=2)

    print("✅ JSON file 'state_politicians.json' has been generated.")

if __name__ == "__main__":
    main()
