import requests

url = "http://localhost:8000/api/query"
payload = {"query": "What are the top 5 models by price?"}

try:
    response = requests.post(url, json=payload)
    data = response.json()
    print("Response Keys:", data.keys())
    print("SQL Query:", data.get("sql_query"))
    print("Chart Type:", data.get("chart_type"))
    print("Chart Data Length:", len(data.get("chart_data")) if data.get("chart_data") else 0)
    print("AI Response:", data.get("response")[:100] + "...")
except Exception as e:
    print("Error:", e)
