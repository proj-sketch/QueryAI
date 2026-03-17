import asyncio
from database import db_manager
from gemini_client import generate_sql_query

async def main():
    datasets = db_manager.list_datasets()
    print("Datasets available:", [d['table_name'] for d in datasets])
    
    query = "What are the top 5 models by price?"
    print(f"Query: {query}")
    
    result = await generate_sql_query(query, datasets)
    print("\nResult:")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
