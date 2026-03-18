from google import genai
from config import GEMINI_API_KEY, GEMINI_MODEL

SYSTEM_PROMPT = """You are QueryAI, an expert business intelligence assistant.

Your role:
- Analyze business questions and provide clear, actionable insights
- When given data context, generate relevant analysis
- Present numbers clearly with comparisons and trends
- Keep responses concise and well-structured
- Use bullet points and sections for clarity
- If a question is vague, provide a helpful general analysis
- If you cannot answer something, explain what data would be needed

Response format:
- Use markdown formatting for readability
- Bold key numbers and metrics
- Use bullet points for lists
- Keep responses under 300 words unless detailed analysis is requested"""


import json
import asyncio

def get_client():
    """Get the Gemini client instance."""
    return genai.Client(api_key=GEMINI_API_KEY)


async def generate_sql_query(query: str, datasets_info: list) -> dict:
    """
    Ask Gemini to convert a natural language query into a SQL query based on the available schemas.
    Also asks for a recommended chart type.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        return {"error": "API Key missing."}

    # Format schema info for the prompt
    schema_text = "Available tables and their columns:\n"
    for ds in datasets_info:
        schema_text += f"- Table: `{ds['table_name']}`\n"
        for col in ds['columns']:
            schema_text += f"  - `{col['name']}` ({col['type']})\n"
            
        if 'sample_rows' in ds and ds['sample_rows']:
            schema_text += "    - Sample Data (first few rows):\n"
            schema_text += f"      {json.dumps(ds['sample_rows'])}\n"

    prompt = f"""You are an expert SQL Generator. Your job is to translate a user's question into a valid SQLite query.
{schema_text}

User Question: {query}

Instructions:
1. Write a valid SQLite query to answer the user's question.
2. Only select the columns needed to answer the question, or to plot a chart.
3. Suggest the most appropriate chart type to visualize the result. Choose ONE of: [bar, line, pie, area, table].

You MUST respond strictly in the following JSON format without any markdown blocks or extra text:
{{
    "sql": "SELECT ...",
    "chart_type": "bar"
}}
"""
    client = get_client()
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            # Parse JSON from response
            # Sometimes Gemini outputs markdown code blocks even if told not to
            raw_text = result.text.strip()
            print(f"[DEBUG] Raw Gemini response for SQL: {raw_text}")
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
                
            parsed = json.loads(raw_text)
            print(f"[DEBUG] Parsed SQL JSON: {parsed}")
            sql_str = parsed.get("sql")
            if sql_str and isinstance(sql_str, str):
                sql_str = sql_str.strip()
                if sql_str.startswith("```sql"):
                    sql_str = sql_str.split("```sql")[1].split("```")[0].strip()
                elif sql_str.startswith("```"):
                    sql_str = sql_str.split("```")[1].split("```")[0].strip()
                    
            return {"sql": sql_str, "chart_type": parsed.get("chart_type"), "error": None}
        except Exception as e:
            error_msg = str(e)
            if ("429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg) and attempt < max_retries - 1:
                print(f"[DEBUG] Gemini API rate limit hit in SQL generation. Retrying in {2 ** attempt} seconds...")
                await asyncio.sleep(2 ** attempt)
                continue
            import traceback
            traceback.print_exc()
            return {"error": f"Failed to generate SQL: {str(e)}"}
    return {"error": "Maximum retries exceeded."}


async def generate_response(query: str, query_results: dict | None = None, chart_type: str = "table", datasets_info: list | None = None) -> dict:
    """
    Send a query and its local execution results to Gemini to generate the final response.
    Returns { "response": str, "error": str | None }
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        return {
            "response": None,
            "error": "Gemini API key not configured. Please add your API key to backend/.env",
        }

    client = get_client()
        
    # Prepare content based on whether we have data
    content = f"{SYSTEM_PROMPT}\n\nUser Query: {query}"
    
    if datasets_info:
        schema_text = "Available tables and their columns:\n"
        for ds in datasets_info:
            schema_text += f"- Table: `{ds['table_name']}`\n"
            for col in ds['columns']:
                schema_text += f"  - `{col['name']}` ({col['type']})\n"
        content += f"\n\n{schema_text}"
    
    if query_results and isinstance(query_results, dict):
        if query_results.get("success"):
            # Include a sample of results to avoid token limits
            rows = query_results.get("results", [])
            row_count = query_results.get("row_count", 0)
            sample_size = min(20, len(rows))
            sample_data = rows[:sample_size]
            
            data_context = f"""
We executed a database query to answer this. 
Total rows returned: {row_count}
Chart Type chosen: {chart_type}

Here is a sample of the data (up to {sample_size} rows):
{json.dumps(sample_data, indent=2)}

Please synthesize an insight based on this data to answer the user's question. Call out key numbers.
"""
            content += f"\n\n{data_context}"
        else:
            # Execution failed
            error_msg = query_results.get("error", "Unknown error")
            data_context = f"""
We attempted to execute a SQL database query to answer this, but it failed with the following error:
{error_msg}

Please try to answer the user's question or explain why it cannot be answered using the provided dataset schemas.
"""
            content += f"\n\n{data_context}"
            
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=content,
            )
            return {
                "response": result.text,
                "error": None,
            }
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                if attempt < max_retries - 1:
                    print(f"[DEBUG] Gemini API rate limit hit. Retrying in {2 ** attempt} seconds...")
                    await asyncio.sleep(2 ** attempt)
                    continue
                else:
                    return {
                        "response": None,
                        "error": "Gemini API rate limit exceeded. Please wait a moment and try again.",
                    }
            elif "403" in error_msg or "API_KEY" in error_msg.upper():
                return {
                    "response": None,
                    "error": "Invalid Gemini API key. Please check your API key in backend/.env",
                }
            else:
                return {
                    "response": None,
                    "error": f"AI Error: {error_msg}",
                }
    return {
        "response": None,
        "error": "Maximum retries exceeded for Gemini API.",
    }

async def generate_dataset_analysis(dataset_name: str, datasets_info: list) -> dict:
    """
    Generate a comprehensive analysis of a dataset including review, KPI queries, chart queries, and suggested questions.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        return {"error": "API Key missing."}

    schema_text = "Available tables and their columns:\n"
    for ds in datasets_info:
        schema_text += f"- Table: `{ds['table_name']}`\n"
        for col in ds['columns']:
            schema_text += f"  - `{col['name']}` ({col['type']})\n"
            
        if 'sample_rows' in ds and ds['sample_rows']:
            schema_text += "    - Sample Data (first few rows):\n"
            schema_text += f"      {json.dumps(ds['sample_rows'])}\n"

    table_name = datasets_info[0]['table_name'] if datasets_info else 'table'
    prompt = f"""You are an expert Data Analyst profiling a new dataset.
{schema_text}

Analyze the provided dataset `{dataset_name}` (table: `{table_name}`) and provide a rich profile.
You MUST output strictly in the following JSON format. Do not use markdown blocks outside the JSON.
{{
  "review": "A detailed 2-3 sentence summary of what this dataset appears to contain and its potential usefulness.",
  "kpis": [
    {{
      "title": "Total Record Count",
      "sql": "SELECT count(*) FROM `{table_name}`"
    }},
    {{
      "title": "Another Key Metric (e.g. Total Revenue)",
      "sql": "..."
    }},
    {{
      "title": "A 3rd Important Metric",
      "sql": "..."
    }}
  ],
  "charts": [
    {{
      "title": "Distribution by Category (example)",
      "chart_type": "pie",
      "sql": "SELECT category_column, count(*) as count FROM `{table_name}` GROUP BY category_column LIMIT 10"
    }},
    {{
      "title": "Trend over Time (if date exists) or Top 10 Items",
      "chart_type": "bar",
      "sql": "..."
    }}
  ],
  "suggested_questions": [
    "What is the average X?",
    "Which category has the highest Y?",
    "How does Z vary over time?"
  ]
}}

Keep chart queries grouped and cleanly aliased (e.g. `as value`, `as label`). Ensure the SQL is completely valid SQLite. Chart types must be one of: [bar, line, pie, area].
Generate 3 KPIs, 2-3 Charts, and 3-4 Suggested questions.
"""
    client = get_client()
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            raw_text = result.text.strip()
            print(f"[DEBUG] Raw Analysis JSON: {raw_text}")
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
                
            parsed = json.loads(raw_text)
            return {"data": parsed, "error": None}
        except Exception as e:
            error_msg = str(e)
            print(f"[ERROR] Gemini generated invalid analysis JSON: {error_msg}")
            if ("429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg) and attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
                continue
            return {"error": f"Failed to generate analysis: {str(e)}"}
    return {"error": "Maximum retries exceeded."}
