# This Python script is performing web scraping to extract commission rate data from a specific
# webpage and then saving that data into a JSON file. Here is a breakdown of what each part of the
# script is doing:
import requests
from bs4 import BeautifulSoup
import json

# Step 1: Define the URL
url = "https://www.dopigo.com/trendyol-komisyon-oranlari-ne-kadar/"

# Step 2: Fetch the webpage content
response = requests.get(url)
response.raise_for_status()  # Ensure the request was successful

# Step 3: Parse the HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Step 4: Extract data from the table
table = soup.find("figure", class_="wp-block-table")  # Locate the table
rows = table.find_all("tr")  # Get all rows in the table

# Skip the header row and process data rows
commission_data = []
platform = "trendyol"  # Hardcoded platform

for row in rows[1:]:  # Skip the header row
    cells = row.find_all("td")
    if len(cells) >= 5:  # Ensure there are enough cells in the row
        category = cells[0].text.strip()
        subcategory = cells[1].text.strip()
        product_group = cells[2].text.strip()
        category_commission = cells[3].text.strip().replace('%', '').replace(',', '.')
        special_commission = cells[4].text.strip().replace('%', '').replace(',', '.')
        
        # Append data as dictionaries
        commission_data.append({
            "platform": platform,
            "category": category,
            "subcategory": subcategory,
            "product_group": product_group,
            "category_commission": category_commission,
            "special_commission": special_commission
        })

# Step 5: Save the extracted data to a JSON file
output = {"commissionRates": commission_data}
output_file = "commission_rates.json"

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Commission rates have been saved to {output_file}")
