import asyncio
import io
import pandas as pd
from database import db_manager

file_path = r"c:\Users\ASUS\OneDrive\Desktop\Query AI\QueryAI-master\QueryAI-master\4. BMW Vehicle Inventory-20260307T060831Z-1-001\4. BMW Vehicle Inventory\BMW Vehicle Inventory.csv"

filename = "BMW Vehicle Inventory.csv"
with open(file_path, "rb") as f:
    contents = f.read()

file_like = io.BytesIO(contents)

try:
    try:
        df = pd.read_csv(file_like)
    except UnicodeDecodeError:
        file_like.seek(0)
        df = pd.read_csv(file_like, encoding='ISO-8859-1')
    print("DataFrame loaded. Shape:", df.shape)
    result = db_manager.ingest_dataframe(df, filename)
    print("Ingestion result:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
